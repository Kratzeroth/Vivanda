import { useState } from "react";

export const RegisterForm = ({ onSubmit }) => {
  const [formValue, setFormValue] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    password: "",
    repetir: "",
  });

  const [errors, setErrors] = useState({});

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  // Validaciones
  const validate = () => {
    const newErrors = {};
    if (!formValue.nombre.trim())
      newErrors.nombre = "El nombre es obligatorio";
    if (!formValue.apellido.trim())
      newErrors.apellido = "El apellido es obligatorio";

    if (!formValue.telefono.trim())
      newErrors.telefono = "Ingrese su teléfono";
    else if (!/^9\d{8}$/.test(formValue.telefono))
      newErrors.telefono = "Teléfono inválido (9 dígitos)";

    if (!formValue.correo.trim())
      newErrors.correo = "Ingrese su correo";
    else if (!/\S+@\S+\.\S+/.test(formValue.correo))
      newErrors.correo = "Correo inválido";

    if (!formValue.password)
      newErrors.password = "La contraseña es obligatoria";

    if (formValue.password !== formValue.repetir)
      newErrors.repetir = "Las contraseñas no coinciden";

    return newErrors;
  };

  // Manejo de envío//
  const handleSubmit = (e) => {
    e.preventDefault();
    const validateErrors = validate();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length === 0) {
      onSubmit(formValue);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        name="nombre"
        placeholder="Nombres"
        className="register-input"
        value={formValue.nombre}
        onChange={handleChange}
      />
      {errors.nombre && <span className="error">{errors.nombre}</span>}

      <input
        type="text"
        name="apellido"
        placeholder="Apellidos"
        className="register-input"
        value={formValue.apellido}
        onChange={handleChange}
      />
      {errors.apellido && <span className="error">{errors.apellido}</span>}

      <input
        type="text"
        name="telefono"
        placeholder="Telefono"
        className="register-input"
        value={formValue.telefono}
        onChange={handleChange}
      />
      {errors.telefono && <span className="error">{errors.telefono}</span>}

      <input
        type="email"
        name="correo"
        placeholder="Correo"
        className="register-input"
        value={formValue.correo}
        
        onChange={handleChange}
      />
      {errors.correo && <span className="error">{errors.correo}</span>}

      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        className="register-input"
        value={formValue.password}
        onChange={handleChange}
      />
      {errors.password && <span className="error">{errors.password}</span>}

      <input
        type="password"
        name="repetir"
        placeholder="Repetir"
        className="register-input"
        value={formValue.repetir}
        onChange={handleChange}
      />
      {errors.repetir && <span className="error">{errors.repetir}</span>}

      <button type="submit" className="register-btn">
        Register
      </button>
    </form>
  );
};
