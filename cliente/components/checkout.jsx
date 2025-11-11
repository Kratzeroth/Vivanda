// src/pages/Checkout.jsx
import { useState, useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [currency, setCurrency] = useState("PEN");
  const exchangeRate = 3.7;

  const navigate = useNavigate();

  // Formateo de inputs
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(value);
  };
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    setExpiry(value);
  };
  const handleCvvChange = (e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
  const handleCardNameChange = (e) => setCardName(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""));

  // Cargar carrito
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return navigate("/login");

    fetch(`http://localhost/Vivanda/cliente/backend/get_cart.php?id_usuario=${usuario.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setCartItems(data.productos);
          const totalCart = data.productos.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
          setTotal(totalCart);
        } else {
          console.warn("Carrito vacío o error:", data);
        }
      })
      .catch(err => console.error("Error cargando carrito:", err));
  }, [navigate]);

  // Validación de tarjeta
  const validateCardForm = () => {
    if (!cardNumber || !expiry || !cvv || !cardName) {
      Swal.fire("Error", "Por favor completa todos los campos de la tarjeta", "error");
      return false;
    }
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
      Swal.fire("Error", "Número de tarjeta inválido", "error");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      Swal.fire("Error", "Fecha de expiración inválida (MM/AA)", "error");
      return false;
    }
    if (!/^\d{3}$/.test(cvv)) {
      Swal.fire("Error", "CVV inválido (deben ser 3 dígitos)", "error");
      return false;
    }
    return true;
  };

  // Manejar pago y registrar en DB
  const handlePayment = async () => {
    if (!validateCardForm()) return;

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    try {
      const res = await fetch("http://localhost/Vivanda/cliente/backend/process_payment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuario.id,
          total: total,
          metodo_pago: "tarjeta"
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        Swal.fire({
          title: "¡Pago exitoso!",
          text: `Tu pago de ${currency === "PEN" ? "S/" : "US$"} ${currency === "PEN" ? total.toFixed(2) : (total / exchangeRate).toFixed(2)} fue procesado correctamente.`,
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#e60023",
        });
        setCartItems([]);
        setTotal(0);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo procesar el pago", "error");
    }
  };

  return (
    <>
      <Header />
      <h1 className="mb-4 fw-bold pt-4 text-center">Pasarela de Pago</h1>
      <div className="row gx-0 gy-4 justify-content-center w-100 mx-0 px-4 px-md-6 animate__animated animate__fadeIn">
        {/* Formulario de tarjeta */}
        <div className="col-12 col-lg-7 px-2 px-lg-4">
          <div className="card border-0 shadow-lg mb-4">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
                <h4 className="card-title mb-0">Pago con Tarjeta</h4>
                <select className="form-select w-auto" value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option value="PEN">Soles (S/)</option>
                  <option value="USD">Dólares (US$)</option>
                </select>
              </div>
              <form autoComplete="off">
                <div className="mb-3">
                  <label className="form-label">Número de tarjeta</label>
                  <input type="text" className="form-control" placeholder="**** **** **** ****"
                    value={cardNumber} onChange={handleCardNumberChange} inputMode="numeric" maxLength={19} autoComplete="cc-number" />
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label">Fecha de expiración</label>
                    <input type="text" className="form-control" placeholder="MM/AA"
                      value={expiry} onChange={handleExpiryChange} inputMode="numeric" maxLength={5} autoComplete="cc-exp" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">CVV</label>
                    <input type="password" className="form-control" placeholder="***"
                      value={cvv} onChange={handleCvvChange} inputMode="numeric" maxLength={3} autoComplete="cc-csc" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" placeholder="Ingresar su nombre"
                    value={cardName} onChange={handleCardNameChange} maxLength={40} autoComplete="cc-name" />
                </div>
                <button type="button" className="btn btn-danger w-100 fw-bold py-2" onClick={handlePayment}>
                  Confirmar Pago
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="col-12 col-lg-5 px-2 px-lg-4">
          <div className="card border-0 shadow-lg mb-4">
            <div className="card-body p-4">
              <h4 className="card-title mb-3">Resumen de tu pedido</h4>
              {cartItems.length === 0 ? (
                <div className="alert alert-info">Tu carrito está vacío</div>
              ) : (
                <ul className="list-group mb-3">
                  {cartItems.map(item => {
                    const itemTotal = currency === "PEN" ? item.precio * item.cantidad : (item.precio * item.cantidad) / exchangeRate;
                    return (
                      <li key={item.id_producto} className="list-group-item d-flex align-items-center flex-wrap py-3">
                        {item.imagen && <img src={item.imagen} alt={item.nombre_producto} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', marginRight: '12px' }} />}
                        <div className="flex-grow-1">
                          <span className="fw-semibold d-block">{item.nombre_producto}</span>
                          <span className="text-muted">Cantidad: <span className="badge bg-primary rounded-pill">{item.cantidad}</span></span>
                        </div>
                        <span className="ms-2 text-secondary fw-bold">{currency === "PEN" ? "S/" : "US$"} {itemTotal.toFixed(2)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <span className="fw-bold">Total:</span>
                <span className="fs-5 fw-bold text-danger">
                  {currency === "PEN" ? "S/ " + total.toFixed(2) : "US$ " + (total / exchangeRate).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body text-center p-3">
              <p className="mb-2"><span role="img" aria-label="secure">🔒</span> Pago 100% seguro</p>
              <div className="d-flex justify-content-center gap-2 mb-2 flex-wrap">
                <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
                <img src="https://img.icons8.com/color/48/mastercard.png" alt="MasterCard" />
                <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" />
              </div>
              <small className="text-muted">Protección de comprador garantizada.</small>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
