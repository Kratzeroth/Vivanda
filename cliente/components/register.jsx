import React from "react";
import { Link } from "react-router-dom";
import "../src/App.css";
import videoFile from "../src/assets/Video/videoplayback.mp4";
import { RegisterForm } from "./RegisterForm"; // Importa el formulario separado
import { Header } from "./header";
import "../src/assets/CSS/register.css";
export function Register() {
  // Función que recibe los datos del formulario válido
  const handleFormSubmit = (data) => {
    console.log("Formulario válido:", data);
    // Aquí podrías enviar los datos a tu servidor
  };

  return (
    <div className="register">
      <Header />
      
        <div className="register-container">
          <video autoPlay loop muted className="background-video">
            <source src={videoFile} type="video/mp4" />
          </video>
          <div className="register-box">
            <h2 className="register-title">Create Account</h2>
            <RegisterForm />
            <p>
              ¿Ya tienes cuenta? <Link className="login-link" to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    
  );
}
