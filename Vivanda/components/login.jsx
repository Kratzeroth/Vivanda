
import React from "react";
import { Link } from "react-router-dom";
import "../src/App.css";
import videoFile from "../src/assets/Video/videoplayback.mp4";

export function Login() {
  return (
    <div className="login-container">
      <video autoPlay loop muted className="background-video">
        <source src={videoFile} type="video/mp4" />
      </video>
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form className="login-form">
          <input type="text" placeholder="Username" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
          <div className="login-options">
            <label><input type="checkbox" /> Recordar</label>
            <a href="#" className="login-forgot">Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="login-btn">Ingresar</button>
        </form>
        <p>¿No tienes una cuenta? <Link className="login-link" to="/register">Registrate</Link></p>
      </div>
    </div>
  );
}
