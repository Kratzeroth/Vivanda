import { useState} from "react";
export const LoginForm = ({ onSubmit }) => {
  const [FormValue, setFormValue] = useState({
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  //cambiar los inputs que se tiene almacenado
  const handleChange = (e) => {
    setFormValue({ ...FormValue, [e.target.name]: e.target.value });

  }
  const validation = () => {
    const newErrors = {};
    if (!FormValue.username.trim()) newErrors.username = "El nombre de Usuario es Requerido";
    if (!FormValue.password.trim()) newErrors.password = "La contraseña es Requerida";

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateErrors = validation();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length === 0) {
      onSubmit(FormValue)
    }
  }
  return (
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
        <a href="#" className="login-forgot">Olvidaste tu contraseña?</a>
      </div>
      <button type="submit" className="login-btn">Ingresar</button>
    </form>
  );
};
