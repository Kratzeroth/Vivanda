import React from 'react';
import "../src/assets/CSS/Asistant.css";
export const Assistant = ({ isOpen, setIsOpen }) => {
    
    if (isOpen) {
        return (
            <>
                <div className="assistant">
                    <div className="assistant-header">
                        <span>Asistente IA</span>
                        <button onClick={() => setIsOpen(false)}>×</button> 
                    </div>
                    <div className="assistant-body">
                        <p>¡Hola! ¿En qué puedo ayudarte hoy?</p>
                    </div>
                    <div className="assistant-footer">
                        <input type="text" placeholder="Escribe un mensaje..." />
                        <button>Enviar</button>
                    </div>
                </div>
                <div 
                    className="assistant-toggle" 
                    onClick={() => setIsOpen(false)}
                >
                    ❌
                </div>
            </>
        );
    }

    return (
        <div 
            className="assistant-toggle" 
            onClick={() => setIsOpen(true)}
        >
            💬
        </div>
    );
};