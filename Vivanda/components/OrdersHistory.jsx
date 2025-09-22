// src/pages/OrdersHistory.jsx
import React, { useState } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import Swal from "sweetalert2";
import "../src/assets/CSS/ordersHistory.css";
import "animate.css";



const initialOrders = [
  {
    id: "ORD-20250901-001",
    date: "2025-09-01",
    status: "Pendiente de pago", // Pendiente de pago, Procesando, Enviado, En camino, Entregado, Cancelado, Devuelto
    canCancel: true,
    canReturn: false,
    totalPEN: 120.5,
    items: [
      { sku: "P001", title: "Café Orgánico 500g", qty: 2, pricePEN: 25.9, img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80" },
      { sku: "P002", title: "Cuchara Medidora", qty: 1, pricePEN: 9.7, img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80" },
    ],
    tracking: [
      { date: "2025-09-01", text: "Pedido recibido", location: "Lima, PE" },
    ],
    reviews: [], // {sku, rating, comment, date}
  },
  {
    id: "ORD-20250825-045",
    date: "2025-08-25",
    status: "En camino",
    canCancel: false,
    canReturn: false,
    totalPEN: 349.0,
    items: [
      { sku: "P100", title: "Patineta Eléctrica TG-2", qty: 1, pricePEN: 349.0, img: "https://itmbikes.com/wp-content/uploads/2024/02/patinenta-electrica-tg2-1.jpg" },
    ],
    tracking: [
      { date: "2025-08-26", text: "Despachado desde almacén", location: "Callao, PE" },
      { date: "2025-08-27", text: "En tránsito", location: "Lima - Distribución" },
    ],
    reviews: [],
  },
  {
    id: "ORD-20250712-202",
    date: "2025-07-12",
    status: "Entregado",
    canCancel: false,
    canReturn: true,
    totalPEN: 89.0,
    items: [
      { sku: "Lego-001", title: "Set LEGO Star Wars", qty: 1, pricePEN: 89.0, img: "https://assets.nintendo.com/image/upload/q_auto/f_auto/ncom/software/switch/70010000018041/e52844f237f452c187db5daec14c3300f45d7be100c1dcff88c7188c8b9b48a9" },
    ],
    tracking: [
      { date: "2025-07-13", text: "Entregado", location: "A. Miraflores" },
    ],
    reviews: [
      { sku: "Lego-001", rating: 5, comment: "Excelente calidad y entrega rápida", date: "2025-07-20" },
    ],
  },
];

export const OrdersHistory = () => {
  const [orders, setOrders] = useState(initialOrders);
  const exchangeRate = 3.64; // tipo conversión S/ -> US$

  // Helper: actualizar un pedido en la lista
  const updateOrder = (id, patch) => {
    setOrders((prev) => prev.map(o => o.id === id ? { ...o, ...patch } : o));
  };

  // Acción: cancelar pedido
  const handleCancel = async (order) => {
    if (!order.canCancel) {
      Swal.fire("No disponible", "Este pedido no puede cancelarse.", "info");
      return;
    }

    const { value } = await Swal.fire({
      title: `Cancelar ${order.id}?`,
      text: "¿Estás seguro que quieres cancelar este pedido?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });
    if (value) {
      // Simular llamada a backend...
      updateOrder(order.id, { status: "Cancelado", canCancel: false });
      setOrders((prev) => prev.map(o => o.id === order.id ? {
        ...o,
        tracking: [...o.tracking, { date: new Date().toISOString().split("T")[0], text: "Pedido cancelado por el usuario", location: "" }],
      } : o));
      Swal.fire("Cancelado", "Tu pedido fue cancelado.", "success");
    }
  };

  // Acción: solicitar devolución
  const handleReturn = async (order) => {
    if (!order.canReturn) {
      Swal.fire("No disponible", "No puedes solicitar devolución para este pedido.", "info");
      return;
    }

    const { value: reason } = await Swal.fire({
      title: `Solicitar devolución - ${order.id}`,
      input: "textarea",
      inputPlaceholder: "Describe el motivo de la devolución...",
      showCancelButton: true,
      confirmButtonText: "Enviar solicitud",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => !value && "Describe el motivo.",
    });

    if (reason) {
      // Simular petición -> backend
      updateOrder(order.id, { status: "Devuelto", canReturn: false });
      setOrders((prev) => prev.map(o => o.id === order.id ? {
        ...o,
        tracking: [...o.tracking, { date: new Date().toISOString().split("T")[0], text: "Solicitud de devolución enviada", location: "" }],
      } : o));
      Swal.fire("Solicitud enviada", "La solicitud de devolución fue enviada.", "success");
    }
  };

  // Acción: ver tracking (popup con eventos)
  const handleViewTracking = (order) => {
    const timeline = order.tracking.map(t => `<li><strong>${t.date}</strong> — ${t.text} ${t.location ? `(${t.location})` : ""}</li>`).join("");
    Swal.fire({
      title: `Seguimiento - ${order.id}`,
      html: `<ul class="swal-tracking">${timeline}</ul>`,
      width: 600,
    });
  };

  // Acción: dejar reseña
  const handleReview = async (order, item) => {
    const { value } = await Swal.fire({
      title: `Dejar reseña - ${item.title}`,
      html:
        `<div style="text-align:left">
           <label>Calificación:</label>
           <div id="rating" style="margin:8px 0">
             <button class="swal-star" data-value="1">★</button>
             <button class="swal-star" data-value="2">★</button>
             <button class="swal-star" data-value="3">★</button>
             <button class="swal-star" data-value="4">★</button>
             <button class="swal-star" data-value="5">★</button>
           </div>
           <textarea id="reviewText" class="swal-textarea" placeholder="Escribe tu reseña..."></textarea>
         </div>`,
      showCancelButton: true,
      confirmButtonText: "Enviar reseña",
      didOpen: () => {
        // Lógica simple para seleccionar estrellas
        const stars = Swal.getHtmlContainer().querySelectorAll(".swal-star");
        let selected = 5;
        stars.forEach(s => {
          s.style.fontSize = "22px";
          s.style.marginRight = "6px";
          s.style.border = "none";
          s.style.background = "transparent";
          s.style.cursor = "pointer";
          s.addEventListener("click", () => {
            selected = Number(s.getAttribute("data-value"));
            stars.forEach((st, idx) => {
              st.style.color = idx < selected ? "#ffb400" : "#ddd";
            });
            (Swal.getConfirmButton() || {}).disabled = false;
            // store in dataset
            Swal.getPopup().dataset.rating = selected;
          });
        });
        // default color
        stars.forEach((st, idx) => st.style.color = idx < selected ? "#ffb400" : "#ddd");
        (Swal.getConfirmButton() || {}).disabled = false;
      },
      preConfirm: () => {
        const rating = Number(Swal.getPopup().dataset.rating || 5);
        const text = Swal.getHtmlContainer().querySelector("#reviewText").value || "";
        if (!text) {
          Swal.showValidationMessage("Escribe algo en la reseña.");
        }
        return { rating, text };
      },
    });

    if (value) {
      // Push review to order
      const review = { sku: item.sku, rating: value.rating, comment: value.text, date: new Date().toISOString().split("T")[0] };
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, reviews: [...o.reviews, review] } : o));
      Swal.fire("Gracias", "Tu reseña fue publicada.", "success");
    }
  };

  // Mostrar precios en USD opcional
  const formatPrice = (amountPEN, currency) => {
    if (currency === "PEN") return `S/ ${amountPEN.toFixed(2)}`;
    return `US$ ${(amountPEN / exchangeRate).toFixed(2)}`;
  };

  // Simular ver detalle del pedido (modal)
  const handleViewDetails = (order) => {
    const html = `
      <div class="swal-order">
        <p><strong>Pedido:</strong> ${order.id}</p>
        <p><strong>Fecha:</strong> ${order.date}</p>
        <p><strong>Estado:</strong> ${order.status}</p>
        <hr />
        <ul>
          ${order.items.map(it => `<li>${it.qty} x ${it.title} — S/ ${it.pricePEN.toFixed(2)}</li>`).join("")}
        </ul>
        <hr />
        <p><strong>Total:</strong> S/ ${order.totalPEN.toFixed(2)}</p>
      </div>`;
    Swal.fire({
      title: "Detalle de pedido",
      html,
      width: 600,
    });
  };

  return (
    <>
      <Header />

      <main className="orders-page">
        <div className="orders-header">
          <h1>Mis Pedidos</h1>
          <p>Historial, seguimiento y acciones sobre tus compras.</p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card animate__animated animate__fadeInUp">
              <div className="order-top">
                <div>
                  <h3>{order.id}</h3>
                  <p className="muted">Fecha: {order.date} · Estado: <span className={`status status-${order.status.replace(/\s+/g,'').toLowerCase()}`}>{order.status}</span></p>
                </div>
                <div className="order-actions">
                  <button className="btn small" onClick={() => handleViewDetails(order)}>Ver</button>
                  <button className="btn small outline" onClick={() => handleViewTracking(order)}>Seguimiento</button>
                </div>
              </div>

              <div className="order-body">
                <div className="items">
                  {order.items.map(it => (
                    <div key={it.sku} className="item">
                      <img src={it.img} alt={it.title} />
                      <div className="item-info">
                        <p className="title">{it.title}</p>
                        <p className="qty">Cantidad: {it.qty}</p>
                        <p className="price">S/ {it.pricePEN.toFixed(2)}</p>
                      </div>
                      <div className="item-actions">
                        {/* Botón reseña */}
                        <button className="btn outline small" onClick={() => handleReview(order, it)}>Dejar reseña</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-right">
                  <div className="summary">
                    <p>Total</p>
                    <p className="total">S/ {order.totalPEN.toFixed(2)}</p>
                  </div>

                  <div className="order-buttons">
                    {order.canCancel && <button className="btn danger" onClick={() => handleCancel(order)}>Cancelar pedido</button>}
                    {order.canReturn && <button className="btn outline" onClick={() => handleReturn(order)}>Solicitar devolución</button>}
                    {!order.canCancel && !order.canReturn && <button className="btn disabled">Sin acciones</button>}
                  </div>

                  {/* quick info: reseñas ya publicadas para este pedido */}
                  <div className="reviews">
                    {order.reviews.length === 0 ? <small className="muted">Sin reseñas</small> :
                      order.reviews.map((r, idx) => (
                        <div key={idx} className="review">
                          <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                          <p className="rev-text">{r.comment}</p>
                          <small className="muted">{r.date}</small>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>

              {/* timeline compacta */}
              <div className="order-tracking">
                <strong>Último evento:</strong>
                <p className="muted">{order.tracking[order.tracking.length - 1]?.date} — {order.tracking[order.tracking.length - 1]?.text}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrdersHistory;
