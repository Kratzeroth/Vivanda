import React from "react";
import { Link } from "react-router-dom";
import "../src/App.css";
import videoFile from "../src/assets/Video/videoplayback.mp4";
export  function Register() {
  return (
    <div className="register-container">
      <video autoPlay loop muted className="background-video">
              <source src={videoFile} type="video/mp4" />
            </video>
      <div className="register-box">
        <h2 className="register-title">Create Account</h2>
        <form className="register-form">
          <input type="text" placeholder="Nombres" className="register-input" />
          <input type="text" placeholder="Apellidos" className="register-input" />
          <input type="text" placeholder="Telefono" className="register-input" />
          <input type="email" placeholder="Correo" className="register-input" />
          <input type="password" placeholder="Contraseña" className="register-input" />
          <input type="password" placeholder="Repetir " className="register-input" />
          <button type="submit" className="register-btn">Register</button>
        </form>
        <p>¿Ya tienes cuenta? <Link className="login-link" to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}
