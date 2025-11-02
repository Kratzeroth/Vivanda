import { useState } from "react";

export const RegisterForm = () => {
  const [formValue, setFormValue] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    password: "",
    repetir: "",
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formValue.nombres.trim()) newErrors.nombres = "El nombre es obligatorio";
    if (!formValue.apellidos.trim()) newErrors.apellidos = "El apellido es obligatorio";
    if (!formValue.telefono.trim()) newErrors.telefono = "Ingrese su teléfono";
    else if (!/^9\d{8}$/.test(formValue.telefono))
      newErrors.telefono = "Teléfono inválido (9 dígitos)";
    if (!formValue.correo.trim()) newErrors.correo = "Ingrese su correo";
    else if (!/\S+@\S+\.\S+/.test(formValue.correo))
      newErrors.correo = "Correo inválido";
    if (!formValue.password) newErrors.password = "La contraseña es obligatoria";
    if (formValue.password !== formValue.repetir)
      newErrors.repetir = "Las contraseñas no coinciden";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateErrors = validate();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length !== 0) return;

    try {
      const payload = {
        nombres: formValue.nombres,
        apellidos: formValue.apellidos,
        telefono: formValue.telefono,
        correo: formValue.correo,
        password: formValue.password,
      };

      const res = await fetch("http://localhost/Vivanda/cliente/backend/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setServerMessage(data.message);

      if (data.status === "success") {
        alert("Registro exitoso. Tu usuario es: " + data.username);
      } else {
        alert("Error" + data.message);
      }
    } catch {
      setServerMessage("Error en la conexión con el servidor");
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <input
        type="text" name="nombres" placeholder="Nombres" className="register-input" value={formValue.nombres} onChange={handleChange}/>
        {errors.nombres && <span className="error">{errors.nombres}</span>}
      <input
        type="text" name="apellidos" placeholder="Apellidos" className="register-input" value={formValue.apellidos} onChange={handleChange}/>
      {errors.apellidos && <span className="error">{errors.apellidos}</span>}
      <input
        type="text" name="telefono" placeholder="Telefono" className="register-input" value={formValue.telefono} onChange={handleChange}/>
      {errors.telefono && <span className="error">{errors.telefono}</span>}
      <input
        type="email" name="correo" placeholder="Correo" className="register-input" value={formValue.correo} onChange={handleChange}/>
      {errors.correo && <span className="error">{errors.correo}</span>}
      <input
        type="password" name="password" placeholder="Contraseña" className="register-input" value={formValue.password} onChange={handleChange}/>
      {errors.password && <span className="error">{errors.password}</span>}
      <input
        type="password" name="repetir" placeholder="Repetir Contraseña" className="register-input" value={formValue.repetir} onChange={handleChange}/>
      {errors.repetir && <span className="error">{errors.repetir}</span>}
      
      <button type="submit" className="register-btn">Registrar</button>
      {serverMessage && <p className="server-message">{serverMessage}</p>}
    </form>
  );
};
