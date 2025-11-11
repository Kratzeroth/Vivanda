import React from "react";
import { LoginForm } from './LoginForm';
import { Link } from "react-router-dom";
import "../src/App.css";
import videoFile from "../src/assets/Video/videoplayback.mp4";
import { Header } from "./header";
import "../src/assets/CSS/login.css";

export function Login() {
  return (
    <div className="login">
      <Header />
      <div className="login-container">

        <video autoPlay loop muted className="background-video">
          <source src={videoFile} type="video/mp4" />
        </video>
        <div className="login-box">
          <h2 className="login-title">Iniciar Sesión</h2>
          <LoginForm />
          <p>¿No tienes una cuenta? <Link className="login-link" to="/register">Registrate</Link></p>
        </div>
      </div>
    </div>
  );
}
