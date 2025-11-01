import React, { useState, useMemo } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import Swal from "sweetalert2";
import "../src/assets/CSS/ordersHistory.css";
import "animate.css"; 


const initialOrders = [
  {
    id: "ORD-20250901-001",
    date: "2025-09-01",
    status: "Pendiente de pago",
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
    reviews: [],
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
  const [activeTab, setActiveTab] = useState("Todos");
  const tabs = ["Todos", "Pendientes", "Finalizados"];

  const updateOrder = (id, patch) => {
    setOrders((prev) => prev.map(o => o.id === id ? { ...o, ...patch } : o));
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "Todos") return orders;
    
    const statusMap = {
      "Pendientes": ["Pendiente de pago", "Procesando", "Enviado", "En camino"],
      "Finalizados": ["Entregado", "Cancelado", "Devuelto"],
    };
    
    const statuses = statusMap[activeTab];
    return orders.filter(order => statuses.includes(order.status));
  }, [orders, activeTab]);

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
      updateOrder(order.id, { status: "Cancelado", canCancel: false });
      setOrders((prev) => prev.map(o => o.id === order.id ? {
        ...o,
        tracking: [...o.tracking, { date: new Date().toISOString().split("T")[0], text: "Pedido cancelado por el usuario", location: "" }],
      } : o));
      Swal.fire("Cancelado", "Tu pedido fue cancelado.", "success");
    }
  };

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
      updateOrder(order.id, { status: "Devuelto", canReturn: false });
      setOrders((prev) => prev.map(o => o.id === order.id ? {
        ...o,
        tracking: [...o.tracking, { date: new Date().toISOString().split("T")[0], text: "Solicitud de devolución enviada", location: "" }],
      } : o));
      Swal.fire("Solicitud enviada", "La solicitud de devolución fue enviada.", "success");
    }
  };

  const handleViewTracking = (order) => {
    const timeline = order.tracking.map(t => `<li style="font-size:15px; margin-bottom: 5px;"><strong>${t.date}</strong> — ${t.text} ${t.location ? `(${t.location})` : ""}</li>`).join("");
    Swal.fire({
      title: `Seguimiento - ${order.id}`,
      html: `<ul class="swal-tracking" style="list-style: none; padding: 0;">${timeline}</ul>`,
      width: 600,
    });
  };

  const handleReview = async (order, item) => {
    const { value } = await Swal.fire({
      title: `Dejar reseña - ${item.title}`,
      html:
        `<div style="text-align:left">
           <label>Calificación:</label>
           <div id="rating" style="margin:8px 0; display:flex; gap:5px;">
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
            Swal.getPopup().dataset.rating = selected;
          });
        });
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
      const review = { sku: item.sku, rating: value.rating, comment: value.text, date: new Date().toISOString().split("T")[0] };
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, reviews: [...o.reviews, review] } : o));
      Swal.fire("Gracias", "Tu reseña fue publicada.", "success");
    }
  };

  const handleViewDetails = (order) => {
    const html = `
      <div class="swal-order">
        <p><strong>Pedido:</strong> ${order.id}</p>
        <p><strong>Fecha:</strong> ${order.date}</p>
        <p><strong>Estado:</strong> ${order.status}</p>
        <hr />
        <ul style="list-style: none; padding: 0;">
          ${order.items.map(it => `<li style="margin-bottom: 5px;">${it.qty} x ${it.title} — S/ ${it.pricePEN.toFixed(2)}</li>`).join("")}
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

        <div className="tabs">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={activeTab === tab ? 'active' : ''} 
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="orders-list">
          {filteredOrders.length > 0 ? filteredOrders.map((order) => (
            <article key={order.id} className="order-card animate__animated animate__fadeInUp">
              <div className="order-top">
                <div>
                  <h3>{order.id}</h3>
                  <p className="muted">Fecha: {order.date} · Estado: <span className={`status status-${order.status.replace(/\s+/g,'').toLowerCase()}`}>{order.status}</span></p>
                </div>
                <div className="order-actions">
                  <button className="btn small outline" onClick={() => handleViewDetails(order)}>Detalles</button>
                  <button className="btn small" onClick={() => handleViewTracking(order)}>Seguimiento</button>
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
                        {order.status === "Entregado" && order.reviews.findIndex(r => r.sku === it.sku) === -1 && <button className="btn outline small" onClick={() => handleReview(order, it)}>Dejar reseña</button>}
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

              <div className="order-tracking">
                <strong>Último evento:</strong>
                <p className="muted">{order.tracking[order.tracking.length - 1]?.date} — {order.tracking[order.tracking.length - 1]?.text}</p>
              </div>
            </article>
          )) : <div className="no-orders">No tienes pedidos en esta categoría.</div>}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrdersHistory;