// src/pages/Checkout.jsx
import { useState } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import Swal from "sweetalert2";
import "../src/assets/CSS/checkout.css";
import "animate.css";

export const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [currency, setCurrency] = useState("PEN");

  const totalPEN = 120.5;
  const exchangeRate = 3.64;
  const total = currency === "PEN" ? totalPEN : totalPEN / exchangeRate;

  const handlePayment = () => {
    Swal.fire({
      title: "¡Pago exitoso!",
      text: `Tu pago de ${
        currency === "PEN" ? "S/" : "US$"
      } ${total.toFixed(2)} fue procesado correctamente.`,
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#e60023",
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    });
  };

  return (
    <>
      <Header />

      <div className="checkout-container">
        <h1 className="title animate__animated animate__fadeInDown">
          💳 Pasarela de Pago
        </h1>

        <div className="checkout-grid">
          {/* Izquierda: formulario */}
          <div className="checkout-left animate__animated animate__fadeInLeft">
            {/* Selección de moneda */}
            <div className="currency-select card-box">
              <label>Moneda: </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="PEN">Soles (S/)</option>
                <option value="USD">Dólares (US$)</option>
              </select>
            </div>

            {/* Métodos de pago */}
            <div className="payment-methods card-box animate__animated animate__fadeInUp">
              <h3>Método de pago</h3>
              <label>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Tarjeta (Visa/MasterCard/Amex)
              </label>
              <label>
                <input
                  type="radio"
                  value="yape"
                  checked={paymentMethod === "yape"}
                  onChange={() => setPaymentMethod("yape")}
                />
                Yape
              </label>
              <label>
                <input
                  type="radio"
                  value="plin"
                  checked={paymentMethod === "plin"}
                  onChange={() => setPaymentMethod("plin")}
                />
                Plin
              </label>
            </div>

            {/* Formulario dinámico */}
            <div className="payment-form card-box animate__animated animate__fadeInUp">
              {paymentMethod === "card" && (
                <form>
                  <div className="form-group">
                    <label>Número de tarjeta</label>
                    <input type="text" placeholder="**** **** **** ****" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiración</label>
                      <input type="text" placeholder="MM/AA" />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="password" placeholder="***" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nombre en la tarjeta</label>
                    <input type="text" placeholder="Diego Tataje" />
                  </div>
                </form>
              )}

              {paymentMethod === "yape" && (
                <div className="qr-payment">
                  <p>Escanea el QR con Yape:</p>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=YAPE-987654321`}
                    alt="QR Yape"
                  />
                  <p className="phone">987 654 321</p>
                </div>
              )}

              {paymentMethod === "plin" && (
                <div className="qr-payment">
                  <p>Escanea el QR con Plin:</p>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PLIN-912345678`}
                    alt="QR Plin"
                  />
                  <p className="phone">912 345 678</p>
                </div>
              )}
            </div>
          </div>

          {/* Derecha: resumen y confianza */}
          <div className="checkout-right animate__animated animate__fadeInRight">
            <div className="checkout-summary card-box">
              <h2>Resumen de tu pedido</h2>
              <p>Total a pagar:</p>
              <h3>
                {currency === "PEN" ? "S/" : "US$"} {total.toFixed(2)}
              </h3>
              <button className="confirm-btn" onClick={handlePayment}>
                Confirmar Pago
              </button>
            </div>

            <div className="trust-box card-box">
              <p>🔒 Pago 100% seguro</p>
              <div className="cards">
                <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
                <img
                  src="https://img.icons8.com/color/48/mastercard.png"
                  alt="MasterCard"
                />
                <img
                  src="https://img.icons8.com/color/48/amex.png"
                  alt="Amex"
                />
              </div>
              <small>Protección de comprador garantizada.</small>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
