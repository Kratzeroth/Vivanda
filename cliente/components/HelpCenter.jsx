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

    const handleSend = (textToSend = input) => {
        if (!textToSend.trim()) return;

        const newMessage = {
            sender: "user",
            text: textToSend,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        
        setMessages(prev => [...prev, newMessage]);
        setInput("");

        // Simulación de respuesta del soporte
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                sender: "support", 
                text: `Gracias por tu consulta ("${textToSend}"). Estamos conectándote con el agente adecuado.`, 
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
            }]);
        }, 1500);
    };

    const handleQuickOptionClick = (option) => {
        handleSend(option);
    };

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
                        <h2>📌 Accesos Rápidos</h2>
                        <ul className="quick-options-list">
                            {quickOptions.map((opt, i) => (
                                <li key={i} onClick={() => handleQuickOptionClick(opt)}>
                                    {opt}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="sidebar-group faq">
                        <h2>❓ Preguntas Frecuentes</h2>
                        <ul className="faq-list">
                            <li><p>Cómo rastreo mi pedido?</p></li>
                            <li><p>Qué métodos de pago aceptan?</p></li>
                            <li><p>Cómo aplico un cupón?</p></li>
                            <li><p>Cómo solicito una devolución?</p></li>
                        </ul>
                    </div>
                </aside>

                <main className="help-chat">
                    <div className="chat-area">
                        <div className="messages">
                            {messages.map((msg, i) => (
                                <div key={i} className={`msg ${msg.sender}`}>
                                    <div className="bubble">{msg.text}</div>
                                    <span className="time">{msg.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="chat-input-area">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Escribe tu mensaje o selecciona una opción rápida..."
                        />
                        <button onClick={() => handleSend()}>Enviar</button>
                    </div>
                </main>
            </div>

            <footer className="help-footer">
                <p>Centro de Ayuda Vivanda | © 2025 Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};