import React, { useState } from "react";
import "../src/assets/CSS/helpCenter.css";

export const HelpCenter = () => {
  const [messages, setMessages] = useState([
    { sender: "support", text: "Bienvenido al Centro de Ayuda de Vivanda. ¿Cómo podemos asistirte hoy?", time: "10:45" }
  ]);
  const [input, setInput] = useState("");
  const quickOptions = [
    "Revisar estado de pedido",
    "Cancelar pedido",
    "Solicitar devolución",
    "Métodos de pago",
    "Factura electrónica",
    "Problemas con reembolso",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages([...messages, newMessage]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "support", text: "Un agente está revisando tu consulta: " + input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1000);
  };

  return (
    <div className="help-container">
      <header className="help-header">
        <img src="https://i.ibb.co/2tB0sPF/vivanda-logo.png" alt="Vivanda" />
        <div>
          <h1>Centro de Ayuda Vivanda</h1>
          <p>Soporte en línea para tus compras y pedidos</p>
        </div>
      </header>

      <div className="help-body">
        <aside className="help-sidebar">
          <h2>Accesos Rápidos</h2>
          <ul>
            {quickOptions.map((opt, i) => (
              <li key={i} onClick={() => setInput(opt)}>{opt}</li>
            ))}
          </ul>
          <div className="faq">
            <h3>Preguntas Frecuentes</h3>
            <p>¿Cómo rastreo mi pedido?</p>
            <p>¿Qué métodos de pago aceptan?</p>
            <p>¿Cómo aplico un cupón?</p>
            <p>¿Cómo solicito una devolución?</p>
          </div>
        </aside>

        <main className="help-chat">
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                <div className="bubble">{msg.text}</div>
                <span className="time">{msg.time}</span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu mensaje aquí..."
            />
            <button onClick={handleSend}>Enviar</button>
          </div>
        </main>
      </div>

      <footer className="help-footer">
        <p>© 2025 Vivanda - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};
