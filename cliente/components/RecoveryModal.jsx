import { useState } from "react";

export const RecoveryModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRecovery = async () => {
    if (!email.trim()) {
      setMessage("Por favor, introduce tu correo.");
      return;
    }

    try {
      const res = await fetch("http://localhost/Vivanda/cliente/backend/forgot_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error al enviar la solicitud.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Recuperación de contraseña</h3>
        <p>Por favor, introduce tu correo electrónico</p>

        <input
          type="email"
          placeholder="tuemail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <button onClick={handleRecovery} className="login-btn">Recuperar</button>
        <button onClick={onClose} className="close-btn">x</button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};
