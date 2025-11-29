import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../src/assets/CSS/helpCenter.css";

const API_URL = "http://localhost/Vivanda/admin/backend/support_chat.php";

const formatTime = (isoString) => {
  if (!isoString) {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const HelpCenter = () => {
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const quickOptions = [
    "Revisar estado de pedido",
    "Cancelar pedido",
    "Solicitar devolución",
    "Métodos de pago",
    "Factura electrónica",
    "Problemas con reembolso",
  ];

  const welcomeMessages = useMemo(
    () => [
      {
        id_mensaje: "welcome",
        remitente: "agent",
        texto: "Bienvenido al Centro de Ayuda de Vivanda. ¿Cómo podemos asistirte hoy?",
        fecha_envio: null,
      },
    ],
    []
  );

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (!stored) {
      setError("Inicia sesión para conversar con un agente de soporte.");
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.id) {
        setUser(parsed);
        setError("");
      } else {
        setError("No se encontró la información del usuario. Inicia sesión nuevamente.");
      }
    } catch (err) {
      console.error("Error parsing usuario", err);
      setError("Ocurrió un problema al leer tu sesión. Inicia sesión nuevamente.");
    }
  }, []);

  const fetchChat = useCallback(
    async ({ silent = false } = {}) => {
      if (!user?.id) return;
      if (!silent) setLoadingChat(true);
      try {
        const res = await fetch(`${API_URL}?action=user_chat&id_usuario=${user.id}&ts=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setChat(data.chat || null);
      } catch (err) {
        console.error("Error fetching chat", err);
        setError("No se pudo conectar con el soporte en este momento.");
      } finally {
        if (!silent) setLoadingChat(false);
      }
    },
    [user?.id]
  );

  const loadMessages = useCallback(
    async (chatId, { showLoader = false } = {}) => {
      if (!chatId) {
        setMessages([]);
        return;
      }
      try {
        if (showLoader) setLoadingMessages(true);
        const res = await fetch(`${API_URL}?action=messages&id_chat=${chatId}&ts=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
        await fetchChat({ silent: true });
      } catch (err) {
        console.error("Error loading messages", err);
        setError("No se pudieron cargar los mensajes del chat.");
      } finally {
        if (showLoader) setLoadingMessages(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!user?.id) return;
    fetchChat();
  }, [fetchChat, user?.id]);

  useEffect(() => {
    if (!chat?.id_chat) {
      setMessages([]);
      return;
    }
    loadMessages(chat.id_chat, { showLoader: true });
    const interval = setInterval(() => loadMessages(chat.id_chat), 4000);
    return () => clearInterval(interval);
  }, [chat?.id_chat, loadMessages]);

  const startNewChat = useCallback(
    async (initialMessage = "") => {
      if (!user?.id) return;
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "start",
            id_usuario: user.id,
            texto: initialMessage.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "No se pudo iniciar el chat");
        }
        await fetchChat();
        if (data.chat?.id_chat) {
          await loadMessages(data.chat.id_chat, { showLoader: true });
        }
        setError("");
      } catch (err) {
        console.error("Error starting chat", err);
        setError("No pudimos crear una nueva conversación.");
      }
    },
    [fetchChat, loadMessages, user?.id]
  );

  const handleSend = async (textToSend = input) => {
    if (!user?.id) {
      setError("Necesitas iniciar sesión para enviar mensajes.");
      return;
    }

    const trimmed = textToSend.trim();
    if (!trimmed) return;

    if (chat?.estado === "Cerrado") {
      await startNewChat(trimmed);
      setInput("");
      return;
    }

    setSending(true);
    try {
      const payload = {
        action: "send",
        texto: trimmed,
        remitente: "user",
        id_chat: chat?.id_chat || 0,
        id_usuario: user.id,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Error enviando el mensaje");
      }

      setInput("");
      const targetChatId = data.message?.id_chat || chat?.id_chat || 0;
      await loadMessages(targetChatId);
      await fetchChat();
      setError("");
    } catch (err) {
      console.error("Error sending message", err);
      setError("No pudimos enviar tu mensaje. Intenta nuevamente");
    } finally {
      setSending(false);
    }
  };

  const handleQuickOptionClick = (option) => {
    handleSend(option);
  };

  const displayMessages = messages.length > 0 ? messages : welcomeMessages;
  const isChatClosed = chat?.estado === "Cerrado";
  const isInputDisabled = !!error || !user?.id || sending;

  return (
    <div className="help-container">
      <header className="help-header">
        <img src="https://i.ibb.co/2tB0sPF/vivanda-logo.png" alt="Vivanda Logo" />
        <div>
          <h1>Centro de Soporte 24/7</h1>
          <p>Habla con un agente o encuentra respuestas rápidas.</p>
        </div>
      </header>

      <div className="help-body">
        <aside className="help-sidebar">
          <div className="sidebar-group">
            <h2> Accesos Rápidos</h2>
            <ul className="quick-options-list">
              {quickOptions.map((opt, i) => (
                <li key={i} onClick={() => handleQuickOptionClick(opt)}>
                  {opt}
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-group faq">
            <h2> Preguntas Frecuentes</h2>
            <ul className="faq-list">
              <li>
                <p>Cómo rastreo mi pedido?</p>
              </li>
              <li>
                <p>Qué métodos de pago aceptan?</p>
              </li>
              <li>
                <p>Cómo aplico un cupón?</p>
              </li>
              <li>
                <p>Cómo solicito una devolución?</p>
              </li>
            </ul>
          </div>
        </aside>

        <main className="help-chat">
          <div className="chat-area">
            <div className="chat-status-bar">
              {loadingChat && <span>Buscando conversaciones abiertas...</span>}
              {!loadingChat && chat?.estado && <span>Estado del chat: {chat.estado}</span>}
              {error && <span className="chat-error">{error}</span>}
            </div>
            <div className="messages">
              {loadingMessages && chat?.id_chat ? (
                <div className="msg info">
                  <div className="bubble">Cargando mensajes...</div>
                </div>
              ) : (
                displayMessages.map((msg) => {
                  const key = msg.id_mensaje || `${msg.remitente}-${msg.fecha_envio || "welcome"}`;
                  const senderClass = msg.remitente === "agent" ? "support" : "user";
                  return (
                    <div key={key} className={`msg ${senderClass}`}>
                      <div className="bubble">{msg.texto}</div>
                      <span className="time">{formatTime(msg.fecha_envio)}</span>
                    </div>
                  );
                })
              )}
              {isChatClosed && (
                <div className="msg info">
                  <div className="bubble">
                    Tu conversación fue cerrada por un agente. Puedes crear un nuevo chat cuando lo necesites.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isInputDisabled && handleSend()}
              placeholder="Escribe tu mensaje o selecciona una opción rápida..."
              disabled={isInputDisabled}
            />
            {isChatClosed ? (
              <button
                onClick={() => startNewChat(input.trim())}
                disabled={!user?.id || sending}
              >
                Crear nuevo chat
              </button>
            ) : (
              <button onClick={() => handleSend()} disabled={isInputDisabled || !input.trim()}>
                {sending ? "Enviando..." : "Enviar"}
              </button>
            )}
          </div>
        </main>
      </div>

      <footer className="help-footer">
        <p>Centro de Ayuda Vivanda | 2025 Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};