import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/supportchat.css";
// ----------------------- DATOS  -----------------------
const initialChats = [
  { id: 1, user: "Laura M.", lastMessage: "¿Pueden cambiar mi dirección?", time: "Hace 2 min", unread: 2, status: "Abierto" },
  { id: 2, user: "Juan P.", lastMessage: "Mi pedido #4587 llegó dañado.", time: "Hace 10 min", unread: 0, status: "Pendiente" },
  { id: 3, user: "Cliente #302", lastMessage: "Necesito factura A.", time: "Hace 1 hora", unread: 1, status: "Abierto" },
  { id: 4, user: "María G.", lastMessage: "Gracias por la ayuda!", time: "Hace 5 horas", unread: 0, status: "Cerrado" },
];

const chatHistory = {
    1: [
        { sender: "user", text: "Hola, ¿podrían ayudarme a cambiar mi dirección de envío? La puse mal.", time: "12:01 PM" },
        { sender: "agent", text: "¡Claro, Laura! Ya reviso tu pedido. ¿Cuál es la nueva dirección completa?", time: "12:02 PM" },
        { sender: "user", text: "Es: Av. Central 1234, Dpto 5B, Lima.", time: "12:05 PM" },
    ],
    2: [
        { sender: "user", text: "Buenas tardes, mi pedido #4587 llegó dañado. Adjunto fotos.", time: "11:50 AM" },
        { sender: "agent", text: "Lamento mucho escuchar eso, Juan. Hemos iniciado el proceso de reemplazo. ¿Prefieres un reembolso o un nuevo envío?", time: "11:55 AM" },
    ],
};


// ----------------------- COMPONENTE PRINCIPAL -----------------------
export default function SupportChat() {
  const [chats, setChats] = useState(initialChats);
  const [selectedChat, setSelectedChat] = useState(initialChats[0]);
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    // Lógica para simular envío de mensaje y actualizar historial
    const newChatHistory = {
        ...chatHistory,
        [selectedChat.id]: [
            ...(chatHistory[selectedChat.id] || []),
            { sender: "agent", text: messageInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
    };
    chatHistory[selectedChat.id] = newChatHistory[selectedChat.id]; 

    // Actualiza el último mensaje y pone unread a 0
    setChats(chats.map(c => 
        c.id === selectedChat.id ? { ...c, lastMessage: messageInput, unread: 0 } : c
    ));
    
    setMessageInput("");
  };
  
  const currentHistory = chatHistory[selectedChat?.id] || [];

  return (
    <div className="layout">
      <Sidebar />
      <div className="support-chat-content">
        <h1>Centro de Soporte y Chat en Vivo</h1>
        
        <div className="chat-container">
          
          {/* --- Panel de Lista de Chats --- */}
          <div className="chat-list-panel">
            <input type="text" placeholder="Buscar chats o tickets..." className="search-input" />
            <div className="chat-filter-bar">
                <button className="filter-btn active">Abiertos</button>
                <button className="filter-btn">Pendientes</button>
                <button className="filter-btn">Cerrados</button>
            </div>
            
            <div className="chat-entries">
              {chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`chat-entry ${chat.id === selectedChat?.id ? 'active' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="chat-info">
                    <span className="chat-user">{chat.user}</span>
                    <span className="chat-time">{chat.time}</span>
                  </div>
                  <p className="chat-preview">{chat.lastMessage}</p>
                  {chat.unread > 0 && <span className="unread-count">{chat.unread}</span>}
                </div>
              ))}
            </div>
          </div>
          
          {/* --- Panel de Conversación --- */}
          <div className="chat-window-panel">
            {selectedChat ? (
              <>
                <div className="chat-header">
                  <h3>Conversación con {selectedChat.user}</h3>
                  <span className={`chat-status ${selectedChat.status.toLowerCase()}`}>{selectedChat.status}</span>
                  <button className="end-chat-btn">Finalizar Chat</button>
                </div>
                
                <div className="chat-history">
                  {currentHistory.map((msg, index) => (
                    <div key={index} className={`message-bubble ${msg.sender}`}>
                      <p>{msg.text}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  ))}
                </div>
                
                <div className="chat-input-area">
                  <textarea
                    placeholder="Escribe tu respuesta aquí..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button onClick={handleSendMessage} className="send-btn">Enviar</button>
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