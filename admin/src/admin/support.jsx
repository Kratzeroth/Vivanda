import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/supportchat.css";

const API_URL = "http://localhost/Vivanda/admin/backend/support_chat.php";

const formatRelativeTime = (isoString) => {
  if (!isoString) return "Sin actividad";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return "Justo ahora";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
};

const formatMessageTime = (isoString) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
};

export default function SupportChat() {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const adminUser = useMemo(() => {
    try {
      const stored = localStorage.getItem("adminUsuario");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Error leyendo adminUsuario", err);
      return null;
    }
  }, []);

  const loadChats = useCallback(
    async ({ showLoader = false } = {}) => {
      try {
        if (showLoader) setLoadingChats(true);
        const res = await fetch(`${API_URL}?action=chats&ts=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (Array.isArray(data.chats)) {
          setChats(data.chats);
        } else {
          throw new Error(data.error || "No se pudieron obtener los chats");
        }
      } catch (err) {
        console.error("Error cargando chats", err);
        setError("No se pudo cargar la lista de chats.");
      } finally {
        if (showLoader) setLoadingChats(false);
      }
    },
    []
  );

  const loadMessages = useCallback(
    async (chatId, { showLoader = false } = {}) => {
      if (!chatId) return;
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
      } catch (err) {
        console.error("Error cargando mensajes", err);
        setError("No se pudieron cargar los mensajes.");
      } finally {
        if (showLoader) setLoadingMessages(false);
      }
    },
    []
  );

  useEffect(() => {
    loadChats({ showLoader: true });
    const interval = setInterval(() => loadChats(), 15000);
    return () => clearInterval(interval);
  }, [loadChats]);

  useEffect(() => {
    if (chats.length === 0) {
      setSelectedChatId(null);
      setMessages([]);
      return;
    }

    if (!selectedChatId || !chats.some((chat) => chat.id_chat === selectedChatId)) {
      setSelectedChatId(chats[0].id_chat);
    }
  }, [chats, selectedChatId]);

  useEffect(() => {
    if (!selectedChatId) return;
    loadMessages(selectedChatId, { showLoader: true });
    const interval = setInterval(() => loadMessages(selectedChatId), 4000);
    return () => clearInterval(interval);
  }, [selectedChatId, loadMessages]);

  const filteredChats = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return chats
      .map((chat) => ({
        ...chat,
        usuario_nombre:
          (chat.usuario_nombre && chat.usuario_nombre.trim()) || `Cliente #${chat.id_usuario}`,
        last_message: chat.last_message || "Sin mensajes",
        last_time_label: chat.last_time ? formatRelativeTime(chat.last_time) : "Sin actividad",
        estado: chat.estado || "Abierto",
      }))
      .filter((chat) => {
        if (!term) return true;
        return (
          chat.usuario_nombre.toLowerCase().includes(term) ||
          String(chat.id_chat).toLowerCase().includes(term)
        );
      })
      .filter((chat) => {
        if (statusFilter === "Todos") return true;
        return chat.estado === statusFilter;
      });
  }, [chats, searchTerm, statusFilter]);

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id_chat === selectedChatId) || null,
    [chats, selectedChatId]
  );

  const handleSelectChat = (chatId) => {
    if (chatId === selectedChatId) return;
    setSelectedChatId(chatId);
    setMessageInput("");
  };

  const handleSendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !selectedChatId) return;
    if (selectedChat?.estado === "Cerrado") {
      setError("Este chat está cerrado. Selecciona otro chat para responder.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          id_chat: selectedChatId,
          texto: trimmed,
          remitente: "agent",
          id_agente: adminUser?.id || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error enviando mensaje");
      }
      setMessageInput("");
      await loadMessages(selectedChatId);
      await loadChats();
      setError("");
    } catch (err) {
      console.error("Error enviando mensaje", err);
      setError("No se pudo enviar el mensaje.");
    } finally {
      setSending(false);
    }
  };

  const handleEndChat = async () => {
    if (!selectedChatId || selectedChat?.estado === "Cerrado") return;
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", id_chat: selectedChatId, estado: "Cerrado" }),
      });
      await loadChats();
      await loadMessages(selectedChatId);
    } catch (err) {
      console.error("Error actualizando estado", err);
      setError("No se pudo actualizar el estado del chat.");
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedChatId) return;
    const confirmed = window.confirm("¿Eliminar este chat y todos sus mensajes?");
    if (!confirmed) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id_chat: selectedChatId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo eliminar el chat");
      }
      setSelectedChatId(null);
      setMessages([]);
      await loadChats({ showLoader: true });
      setError("");
    } catch (err) {
      console.error("Error eliminando chat", err);
      setError("No se pudo eliminar el chat.");
    }
  };

  const isChatClosed = selectedChat?.estado === "Cerrado";

  return (
    <div className="layout">
      <Sidebar />
      <div className="support-chat-content">
        <h1>Centro de Soporte y Chat en Vivo</h1>

        {error && <div className="chat-error-banner">{error}</div>}

        <div className="chat-container">
          <div className="chat-list-panel">
            <input
              type="text"
              placeholder="Buscar chats o tickets..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="chat-filter-bar">
              {[
                { label: "Todos", value: "Todos" },
                { label: "Abiertos", value: "Abierto" },
                { label: "Pendientes", value: "Pendiente" },
                { label: "Cerrados", value: "Cerrado" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  className={`filter-btn ${statusFilter === filter.value ? "active" : ""}`}
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="chat-entries">
              {loadingChats ? (
                <div className="chat-empty-state">Cargando conversaciones...</div>
              ) : filteredChats.length === 0 ? (
                <div className="chat-empty-state">No hay chats disponibles.</div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id_chat}
                    className={`chat-entry ${chat.id_chat === selectedChatId ? "active" : ""}`}
                    onClick={() => handleSelectChat(chat.id_chat)}
                  >
                    <div className="chat-info">
                      <span className="chat-user">{chat.usuario_nombre}</span>
                      <span className="chat-time">{chat.last_time_label}</span>
                    </div>
                    <p className="chat-preview">{chat.last_message}</p>
                    <span className={`chat-status-pill ${chat.estado.toLowerCase()}`}>
                      {chat.estado}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="chat-window-panel">
            {selectedChat ? (
              <>
                <div className="chat-header">
                  <h3>
                    Conversación con
                    {" "}
                    {selectedChat.usuario_nombre?.trim() || `Cliente #${selectedChat.id_usuario}`}
                  </h3>
                  <span className={`chat-status ${selectedChat.estado?.toLowerCase()}`}>
                    {selectedChat.estado}
                  </span>
                  <button
                    className="end-chat-btn"
                    onClick={handleEndChat}
                    disabled={selectedChat.estado === "Cerrado"}
                  >
                    {selectedChat.estado === "Cerrado" ? "Chat cerrado" : "Finalizar Chat"}
                  </button>
                  <button className="delete-chat-btn" onClick={handleDeleteChat}>
                    Eliminar chat
                  </button>
                </div>

                <div className="chat-history">
                  {loadingMessages ? (
                    <div className="chat-empty-state">Cargando mensajes...</div>
                  ) : messages.length === 0 ? (
                    <div className="chat-empty-state">
                      Aún no hay mensajes en esta conversación.
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const bubbleType = msg.remitente === "user" ? "user" : "agent";
                      return (
                        <div
                          key={msg.id_mensaje || `${msg.remitente}-${msg.fecha_envio}`}
                          className={`message-bubble ${bubbleType}`}
                        >
                          <p>{msg.texto}</p>
                          <span className="message-time">{formatMessageTime(msg.fecha_envio)}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="chat-input-area">
                  <textarea
                    placeholder="Escribe tu respuesta aquí..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={isChatClosed}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="send-btn"
                    disabled={sending || !messageInput.trim() || isChatClosed}
                  >
                    {sending ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                Selecciona una conversación de la izquierda para comenzar a responder.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}