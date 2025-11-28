
/* eslint-disable no-console */
const CHAT_WEBHOOK_URL = 'http://localhost:5678/webhook/2584c5e0-67e7-44ff-897e-ee83683df8ba/chat';
const LOGGER_ENDPOINT = 'http://localhost/Vivanda/cliente/backend/chatbot_logger.php';
const GUEST_TOKEN_KEY = 'chatbot_guest_token';
const USER_STORAGE_KEY = 'usuario';

if (typeof window !== 'undefined' && typeof window.fetch === 'function' && !window.__vivandaChatLoggerPatched) {
  window.__vivandaChatLoggerPatched = true;

  const originalFetch = window.fetch.bind(window);

  const resolveBodyText = async (body) => {
    if (!body) {
      return null;
    }

    if (typeof body === 'string') {
      return body;
    }

    if (body instanceof URLSearchParams || body instanceof FormData) {
      return body.toString();
    }

    try {
      const cloned = body instanceof Blob ? body : body.stream ? new Response(body) : new Response(body);
      return await cloned.text();
    } catch (err) {
      console.warn('No se pudo leer el cuerpo de la petición del chatbot', err);
      return null;
    }
  };

  const parseJSON = (text) => {
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      return null;
    }
  };

  const normalizeText = (value) => {
    if (typeof value !== 'string') {
      return null;
    }

    const trimmed = value.trim();
    return trimmed !== '' ? trimmed : null;
  };

  const hasMeaningfulContent = (text) => {
    if (!text) {
      return false;
    }

    const trimmed = text.trim();
    if (!trimmed || trimmed === '{}' || trimmed === '[]') {
      return false;
    }

    const contentRegex = /[A-Za-zÀ-ÿ0-9]/;
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return contentRegex.test(trimmed);
    }

    try {
      const parsed = JSON.parse(trimmed);

      const traverse = (value) => {
        if (typeof value === 'string') {
          const normalized = normalizeText(value);
          return normalized ? contentRegex.test(normalized) : false;
        }
        if (Array.isArray(value)) {
          return value.some((item) => traverse(item));
        }
        if (value && typeof value === 'object') {
          return Object.values(value).some((v) => traverse(v));
        }
        return false;
      };

      return traverse(parsed);
    } catch (err) {
      return contentRegex.test(trimmed);
    }
  };

  const pickFromCandidates = (payload, candidates) => {
    for (const candidate of candidates) {
      if (candidate && typeof candidate === 'string') {
        const normalized = normalizeText(candidate);
        if (normalized) {
          return normalized;
        }
      }
    }
    return null;
  };

  const findMessageInObject = (payload) => {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    if (Array.isArray(payload)) {
      for (const entry of payload) {
        const result = findMessageInObject(entry);
        if (result) {
          return result;
        }
      }
      return null;
    }

    const directMatch = pickFromCandidates(payload, [
      payload.message,
      payload.text,
      payload.prompt,
      payload.query,
      payload.input,
    ]);

    if (directMatch) {
      return directMatch;
    }

    const nestedKeys = [
      'data',
      'body',
      'payload',
      'chatInput',
      'input',
      'output',
      'response',
      'result',
      'messages',
    ];

    for (const key of nestedKeys) {
      if (payload[key]) {
        const nested = findMessageInObject(payload[key]);
        if (nested) {
          return nested;
        }
      }
    }

    return null;
  };

  const IGNORED_ACTIONS = new Set([
    'loadPreviousSession',
    'loadSession',
    'loadHistory',
    'initialMount',
    'getConfig',
  ]);

  const extractUserQuestion = (requestPayload) => {
    if (!requestPayload || typeof requestPayload !== 'object') {
      return null;
    }

    if (requestPayload.event && requestPayload.event !== 'message') {
      return null;
    }

    if (typeof requestPayload.action === 'string' && IGNORED_ACTIONS.has(requestPayload.action)) {
      return null;
    }

    const question = findMessageInObject(requestPayload);
    return normalizeText(question);
  };

  const extractAssistantAnswer = (responsePayload) => {
    if (!responsePayload) {
      return null;
    }

    const answer = findMessageInObject(responsePayload);
    return normalizeText(answer);
  };

  const getUserId = () => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed.id === 'number' ? parsed.id : null;
    } catch (err) {
      console.warn('No se pudo leer el usuario almacenado', err);
      return null;
    }
  };

  const getGuestToken = () => {
    try {
      return localStorage.getItem(GUEST_TOKEN_KEY);
    } catch (err) {
      console.warn('No se pudo leer el token de invitado', err);
      return null;
    }
  };

  const persistGuestToken = (token) => {
    if (!token) {
      return;
    }

    try {
      localStorage.setItem(GUEST_TOKEN_KEY, token);
    } catch (err) {
      console.warn('No se pudo guardar el token de invitado', err);
    }
  };

  const sendLog = async (question, answer) => {
    const idUsuario = getUserId();
    const guestToken = idUsuario ? null : getGuestToken();

    const payload = {
      pregunta: question || null,
      respuesta: answer || null,
    };

    if (idUsuario) {
      payload.id_usuario = idUsuario;
    }

    if (!idUsuario && guestToken) {
      payload.guest_token = guestToken;
    }

    if (!payload.pregunta && !payload.respuesta) {
      return;
    }

    try {
      const response = await originalFetch(LOGGER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (data && data.status === 'success' && data.guest_token) {
        persistGuestToken(data.guest_token);
      }
    } catch (err) {
      console.warn('No se pudo registrar el mensaje del chatbot', err);
    }
  };

  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input && input.url ? input.url : '';
    const isChatRequest = typeof url === 'string' && url.startsWith(CHAT_WEBHOOK_URL);

    let requestBodyText = null;
    if (isChatRequest && init && init.body) {
      requestBodyText = await resolveBodyText(init.body);
    }

    const response = await originalFetch(input, init);

    if (!isChatRequest) {
      return response;
    }

    try {
      const requestPayload = parseJSON(requestBodyText);
      const question = extractUserQuestion(requestPayload);
      const shouldSkipFallbackQuestion = requestPayload && typeof requestPayload === 'object' && IGNORED_ACTIONS.has(requestPayload.action);
      const fallbackQuestion = question || shouldSkipFallbackQuestion ? null : normalizeText(requestBodyText);

      const clonedResponse = response.clone();
      const responseText = await clonedResponse.text();
      const responsePayload = parseJSON(responseText);
      const answer = extractAssistantAnswer(responsePayload);
      const shouldSkipFallbackAnswer = responsePayload && typeof responsePayload === 'object' && IGNORED_ACTIONS.has(responsePayload.action);
      const fallbackAnswer = answer || shouldSkipFallbackAnswer ? null : normalizeText(responseText);

      let finalQuestion = question || fallbackQuestion;
      let finalAnswer = answer || fallbackAnswer;

      if (!hasMeaningfulContent(finalQuestion)) {
        finalQuestion = null;
      }

      if (!hasMeaningfulContent(finalAnswer)) {
        finalAnswer = null;
      }

      if (finalQuestion || finalAnswer) {
        await sendLog(finalQuestion, finalAnswer);
      }
    } catch (err) {
      console.warn('Fallo al procesar el registro de chatbot', err);
    }

    return response;
  };
}
