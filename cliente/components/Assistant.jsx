import { useEffect } from "react";

export default function Assistant() {
  useEffect(() => {
    // Cargar estilos del chat
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Aplicar paleta TeleHealth+
    const style = document.createElement("style");
    style.innerHTML = `
      :root {
        /* Colores principales */
        --chat--color-primary: #22c55e;
        --chat--color-primary-shade-50: #1ea653;
        --chat--color-primary-shade-100: #1a8c46;
        --chat--color-secondary: #16a34a;
        --chat--color-dark: #1e293b;
        --chat--color-light: #f0fdf4;
        --chat--color-white: #ffffff;
        --chat--color-disabled: #9ca3af;

        /* Fondo y texto */
        --chat--message--bot--background: #ffffff;
        --chat--message--bot--color: #1e293b;
        --chat--message--user--background: #22c55e;
        --chat--message--user--color: #ffffff;

        /* Burbuja */
        --chat--toggle--background: #22c55e;
        --chat--toggle--hover--background: #1ea653;
        --chat--toggle--active--background: #1a8c46;
        --chat--toggle--color: #ffffff;
        --chat--toggle--size: 60px;

        /* Ventana del chat */
        --chat--window--width: 400px;
        --chat--window--height: 600px;
        --chat--border-radius: 20px;
        --chat--header--background: #22c55e;
        --chat--header--color: #ffffff;
        
        /* Tipografía */
        --chat--message--font-size: 1rem;
        --chat--heading--font-size: 1.3rem;
      }

      @media (max-width: 768px) {
        :root {
          --chat--window--bottom: 70px; /* Ajusta la posición solo en pantallas pequeñas */
        }
      }
    `;
    document.head.appendChild(style);

    // Crear script del chat
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

      createChat({
        webhookUrl: 'http://localhost:5678/webhook/2584c5e0-67e7-44ff-897e-ee83683df8ba/chat',
        mode: 'window',
        target: '#n8n-chat',
        showWelcomeScreen: false,
        enableStreaming: false,
        defaultLanguage: 'es',
        initialMessages: [
           '¡Hola! Soy VivaBot, tu asistente virtual de Vivanda.',
          '¿En qué puedo ayudarte hoy?'
        ],
        i18n: {
          es: {
            title: 'VivaBot',
            subtitle: '',
            inputPlaceholder: 'Escribe tu mensaje...',
            getStarted: 'Nueva conversación'
          }
        },
        poweredBy: false
      });
    `;
    document.body.appendChild(script);
  }, []);

  return <div id="n8n-chat"></div>;
}
