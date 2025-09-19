import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
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
        console.log("📤 Enviando:", formValue);
        const res = await fetch("http://localhost/Vivanda/Vivanda/backend/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValue),
        });

        const data = await res.json();
        console.log("📥 Respuesta:", data);
        setServerMessage(data.message);

        if (data.status === "success") {
          // Guardar sesión en localStorage
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          if (data.usuario.rol === "Administrador") {
    navigate("/admin");  // 🚀 si es admin → al panel admin
  } else {
    navigate("/home");   // 🚀 si es usuario normal → home
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
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <input
        type="text" placeholder="Username" className="login-input" name="username" onChange={handleChange}/>
      {errors.username && <p className="error">{errors.username}</p>}
      <input
        type="password" placeholder="Password" className="login-input" name="password" onChange={handleChange}/>
      {errors.password && <p className="error">{errors.password}</p>}

      <div className="login-options">
        <label>
          <input type="checkbox" /> Recordar
        </label>
        <a href="#" className="login-forgot">¿Olvidaste tu contraseña?</a>
      </div>

      <button type="submit" className="login-btn">Ingresar</button>

      {serverMessage && <p>{serverMessage}</p>}
    </form>
  );
};
