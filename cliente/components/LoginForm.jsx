import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecoveryModal } from "./RecoveryModal"; // 👈 nuevo modal

export const LoginForm = () => {
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [showRecovery, setShowRecovery] = useState(false); // 👈 controla el modal
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const validation = () => {
    const newErrors = {};
    if (!formValue.username.trim()) newErrors.username = "El nombre de Usuario es Requerido";
    if (!formValue.password.trim()) newErrors.password = "La contraseña es Requerida";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateErrors = validation();
    setErrors(validateErrors);

    if (Object.keys(validateErrors).length === 0) {
      try {
        const res = await fetch("http://localhost/Vivanda/cliente/backend/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValue),
        });

        const data = await res.json();
        setServerMessage(data.message);

        if (data.status === "success") {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          if (data.usuario.rol === "Administrador") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        setServerMessage("Error en la conexión con el servidor");
      }
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          placeholder="Username"
          className="login-input"
          name="username"
          onChange={handleChange}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          name="password"
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <div className="login-options">
          <label>
            <input type="checkbox" /> Recordar
          </label>
          <a
            href="#"
            className="login-forgot"
            onClick={(e) => {
              e.preventDefault();
              setShowRecovery(true); // 👈 abre modal
            }}
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button type="submit" className="login-btn">Ingresar</button>

        {serverMessage && <p>{serverMessage}</p>}
      </form>

      {/* Modal */}
      {showRecovery && <RecoveryModal onClose={() => setShowRecovery(false)} />}
    </>
  );
};
