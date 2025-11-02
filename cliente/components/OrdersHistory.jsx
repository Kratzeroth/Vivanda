// src/pages/OrdersHistory.jsx
import React, { useState, useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import Swal from "sweetalert2";

import "animate.css";


export const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingModal, setTrackingModal] = useState(false); // State for tracking modal
  const [activeTab, setActiveTab] = useState('Todos');



  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setTrackingModal(true);
  };

  const closeTrackingModal = () => {
    setTrackingModal(false);
    setSelectedOrder(null);
  };



  const getTrackingSteps = (status, orderDate) => {
    const baseDate = new Date(orderDate);
    const steps = [
      { label: "Pedido recibido", date: new Date(baseDate), completed: true },
      { label: "Preparando el pedido", date: new Date(baseDate.setDate(baseDate.getDate() + 1)), completed: status !== "pendiente" },
      { label: "En camino", date: new Date(baseDate.setDate(baseDate.getDate() + 2)), completed: status === "en camino" || status === "enviado" || status === "entregado" },
      { label: "Entregado", date: new Date(baseDate.setDate(baseDate.getDate() + 3)), completed: status === "entregado" },
    ];
    return steps;
  };

  const getDetailedTrackingSteps = (status) => {
    const steps = [
      { label: "Pedido realizado", completed: true },
      { label: "El pedido se pagó correctamente", completed: true },
      { label: "El almacén comenzó a preparar tu pedido", completed: status !== "pendiente" },
      { label: "La tarea de recogida se asignó y tu pedido está en espera para la recogida", completed: status !== "pendiente" },
      { label: "Tus artículos se recogieron y están a la espera de empacarse", completed: status !== "pendiente" },
      { label: "Tu paquete está a la espera de cargarse en un contenedor para su envío", completed: status === "en camino" || status === "enviado" || status === "entregado" },
      { label: "En tránsito al almacén del país de destino", completed: status === "enviado" || status === "entregado" },
      { label: "Llegó al aeropuerto del país de destino", completed: status === "entregado" },
      { label: "Salió del aeropuerto y está en camino a tu dirección", completed: status === "entregado" },
      { label: "Llegó y está preparado para la entrega", completed: status === "entregado" },
      { label: "Pedido entregado", completed: status === "entregado" },
    ];
    return steps;
  };

  const getLocalTrackingSteps = (status) => {
    const steps = [
      { label: "Pedido realizado", completed: true },
      { label: "Pago confirmado", completed: true },
      { label: "Preparando el pedido", completed: status !== "pendiente" },
      { label: "Pedido listo para despacho", completed: status === "en camino" || status === "enviado" || status === "entregado" },
      { label: "En camino", completed: status === "en camino" || status === "entregado" },
      { label: "Pedido entregado", completed: status === "entregado" },
    ];
    return steps;
  };

  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(date).toLocaleDateString("es-PE", options);
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    fetch(`http://localhost/Vivanda/cliente/backend/get_user.php?id=${usuario.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          Swal.fire("Error", data.error, "error");
        } else {
          const pedidos = data.pedidos.map(p => ({
            id: p.id_pedido,
            date: p.fecha_pedido.split(" ")[0],
            status: p.estado,
            totalPEN: Number(p.total),
            fecha_entrega: p.fecha_entrega ? p.fecha_entrega.split(" ")[0] : null,
            items: p.items.map(it => ({
              sku: it.id_producto,
              title: it.nombre_producto,
              qty: Number(it.cantidad),
              pricePEN: Number(it.precio_unitario),
              img: `/images/productos/${it.imagen_url.split("/").pop()}`
            })),
            reviews: p.reviews || [] // <--- usar las reseñas del backend
          }));
          setOrders(pedidos);
        }
      })
      .catch(err => Swal.fire("Error", err.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleReview = async (order, item) => {
    const { value } = await Swal.fire({
      title: `<span style="font-size:1.1rem;font-weight:600;">Dejar reseña - ${item.title}</span>`,
      html: `
        <div style="text-align:left; font-family: 'Segoe UI', Arial, sans-serif;">
          <label style="font-weight:500;">Calificación:</label>
          <div id="rating" style="margin:8px 0 16px 0; display:flex; gap:6px;">
            ${[1,2,3,4,5].map(v => `<button class="swal-star" data-value="${v}" style="font-size:24px; background:none; border:none; color:#ddd; cursor:pointer;">★</button>`).join('')}
          </div>
          <label style="font-weight:500;">Tu reseña:</label>
          <textarea id="reviewText" class="swal-textarea" placeholder="Escribe tu reseña..." style="width:100%;min-height:70px;resize:vertical;border-radius:8px;border:1px solid #ddd;padding:8px;margin-top:4px;"></textarea>
        </div>`,
      showCancelButton: true,
      confirmButtonText: "Enviar reseña",
      customClass: { popup: 'swal2-responsive-modal' },
      didOpen: () => {
        const stars = Swal.getHtmlContainer().querySelectorAll(".swal-star");
        let selected = 5;
        stars.forEach(s => {
          s.addEventListener("click", () => {
            selected = Number(s.getAttribute("data-value"));
            stars.forEach((st, idx) => st.style.color = idx < selected ? "#ffb400" : "#ddd");
            Swal.getPopup().dataset.rating = selected;
          });
        });
        stars.forEach((st, idx) => st.style.color = idx < selected ? "#ffb400" : "#ddd");
      },
      preConfirm: () => {
        const rating = Number(Swal.getPopup().dataset.rating || 5);
        const text = Swal.getHtmlContainer().querySelector("#reviewText").value || "";
        if (!text) Swal.showValidationMessage("Escribe algo en la reseña.");
        return { rating, text };
      }
    });

    if (value) {
      const review = { sku: item.sku, rating: value.rating, comment: value.text, date: new Date().toISOString().split("T")[0] };

      // Enviar al backend
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      fetch("http://localhost/Vivanda/vivanda/backend/add_review.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          id_producto: item.sku,
          calificacion: review.rating,
          comentario: review.comment
        })
      })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setOrders(prev => prev.map(o => o.id === order.id ? { ...o, reviews: [...o.reviews, review] } : o));
          Swal.fire({
            icon: "success",
            title: "¡Gracias!",
            text: "Tu reseña fue publicada.",
            timer: 1800,
            showConfirmButton: false,
            customClass: { popup: 'swal2-responsive-modal' }
          });
        } else {
          Swal.fire("Error", resData.error || "No se pudo guardar la reseña.", "error");
        }
      })
      .catch(err => Swal.fire("Error", err.message, "error"));
    }
  };

  const statusColors = {
    pendiente: "orange",
    "en camino": "blue",
    enviado: "purple",
    entregado: "green",
    cancelado: "red",
  };

  const formatStatus = (status) => {
    return status
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  const formatDateRange = (startDate) => {
    if (!startDate) return "";
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 5); // ejemplo: entrega en 5 días
    const options = { day: "numeric", month: "short" };
    return `${start.toLocaleDateString("es-PE", options)} - ${end.toLocaleDateString("es-PE", options)}`;
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando pedidos...</p>;

  // Filtrar pedidos según el tab activo
  let filteredOrders = orders;
  if (activeTab === 'Pendientes') {
    filteredOrders = orders.filter(o => {
      const st = o.status.toLowerCase().replace(/_/g, '');
      return st === 'pendiente' || st === 'encamino' || st === 'enviado';
    });
  } else if (activeTab === 'Finalizados') {
    filteredOrders = orders.filter(o => {
      const st = o.status.toLowerCase().replace(/_/g, '');
      return st === 'entregado';
    });
  }

  return (
    <>
      <Header />
      <main className="container my-4">
        <div className="text-center mb-4">
          <h1 className="display-5">Mis Pedidos</h1>
        </div>
        {/* Tabs alineados a la izquierda */}
        <div className="mb-4 d-flex justify-content-start gap-2">
          {['Todos', 'Pendientes', 'Finalizados'].map(tab => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{ minWidth: 120 }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="d-flex flex-column gap-4">
          {filteredOrders.length === 0 && <p className="text-center">No tienes pedidos registrados.</p>}
          {filteredOrders.map(order => (
            <div key={order.id} className="card shadow-sm animate__animated animate__fadeInUp mb-3">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h5 className="mb-1">
                    Pedido |{' '}
                    <span style={{ color: statusColors[formatStatus(order.status).toLowerCase()] || 'black' }}>
                      {formatStatus(order.status)}
                    </span>
                  </h5>
                  <div className="text-muted small">
                    Entrega: {formatDateRange(order.fecha_entrega)}
                  </div>
                </div>
              </div>
              <div className="card-body row gx-4 gy-3">
                <div className="col-md-8">
                  {order.items.map(it => (
                    <div key={it.sku} className="d-flex align-items-center bg-light rounded p-2 mb-2">
                      <img src={it.img} alt={it.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 12 }} />
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{it.title}</div>
                        <div className="text-muted small">Cantidad: {it.qty}</div>
                        <div className="fw-bold">S/ {it.pricePEN.toFixed(2)}</div>
                      </div>
                      <button className="btn btn-outline-secondary btn-sm ms-2" onClick={() => handleReview(order, it)}>Dejar reseña</button>
                    </div>
                  ))}
                </div>
                <div className="col-md-4 d-flex flex-column gap-2">
                  <div className="border rounded p-2 mb-2">
                    <div className="fw-semibold">Total</div>
                    <div className="text-success fs-5 fw-bold">S/ {order.totalPEN.toFixed(2)}</div>
                  </div>
                  <button className="btn btn-primary mb-2" onClick={() => handleTrackOrder(order)}>Rastrear</button>
                  <div>
                    {order.reviews.length === 0 ? (
                      <small className="text-muted">Sin reseñas</small>
                    ) : (
                      order.reviews.map((r, idx) => (
                        <div key={idx} className="bg-light rounded p-2 mb-1">
                          <div className="text-warning">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                          <div className="small">{r.comment}</div>
                          <small className="text-muted">{r.date}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal de rastreo */}
      {trackingModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Estado del Rastreo</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeTrackingModal}></button>
              </div>
              <div className="modal-body">
                {selectedOrder && (
                  <>
                    <div className="mb-3 text-secondary small">
                      <b>Pedido ID:</b> {selectedOrder.id} &nbsp;|&nbsp;
                      <b>Estado:</b> {formatStatus(selectedOrder.status)}
                    </div>
                    <hr />
                    <ul className="list-unstyled">
                      {getLocalTrackingSteps(selectedOrder.status).map((step, index) => (
                        <li key={index} className="d-flex align-items-start mb-3">
                          <div
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              backgroundColor: step.completed ? 'green' : '#ddd',
                              marginRight: 14,
                              marginTop: 4,
                            }}
                          ></div>
                          <div className="flex-grow-1">
                            <span className={step.completed ? 'fw-semibold' : 'text-muted'}>{step.label}</span>
                          </div>
                          {index < getLocalTrackingSteps(selectedOrder.status).length - 1 && (
                            <div
                              style={{
                                width: 2,
                                height: 40,
                                backgroundColor: step.completed ? 'green' : '#ddd',
                                marginLeft: 10,
                              }}
                            ></div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeTrackingModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default OrdersHistory;
