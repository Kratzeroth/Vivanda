import { useState, useEffect } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/orders.css";




export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
  fetch("http://localhost/Vivanda/admin/backend/orders.php")
      .then(async (res) => {
        if (!res.ok) throw new Error("Error al cargar pedidos");
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          return json;
        } catch (e) {
          // Mostrar el HTML recibido para depuración
          throw new Error("Respuesta no es JSON. Respuesta recibida: " + text.substring(0, 300));
        }
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);



  const filteredOrders = orders.filter(order => {
    if (filter === "Todos") return true;
    // Normaliza para comparar
    const estado = order.status.replace(/_/g, ' ').toLowerCase();
    return estado === filter.toLowerCase() &&
      (order.customer.toLowerCase().includes(search.toLowerCase()) || 
       order.id.toString().includes(search));
  });


  // Contadores por estado
  const countPendiente = orders.filter(o => o.status.replace(/_/g, ' ').toLowerCase() === "pendiente").length;
  const countEnCamino = orders.filter(o => o.status.replace(/_/g, ' ').toLowerCase() === "en camino").length;
  const countEntregado = orders.filter(o => o.status.replace(/_/g, ' ').toLowerCase() === "entregado").length;
  const countCancelado = orders.filter(o => o.status.replace(/_/g, ' ').toLowerCase() === "cancelado").length;

  return (
    <div className="layout">
      <Sidebar />
      <div className="orders-content">
        <h1>Pedidos</h1>
        {/* Barra de búsqueda y filtros */}
        <div className="orders-top">
          <input
            type="text"
            placeholder="Buscar por cliente o ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option>Todos</option>
            <option>Pendiente</option>
            <option>En camino</option>
            <option>Entregado</option>
            <option>Cancelado</option>
          </select>
        </div>
        {/* Estado de carga o error */}
        {loading && <div className="orders-loading">Cargando pedidos...</div>}
        {error && <div className="orders-error">{error}</div>}
        {/* Cuadros de resumen por estado */}
        <div className="orders-summary">
          <div className="summary-box pendiente">Pendientes: {countPendiente}</div>
          <div className="summary-box en-camino">En camino: {countEnCamino}</div>
          <div className="summary-box entregado">Entregados: {countEntregado}</div>
          <div className="summary-box cancelado">Cancelados: {countCancelado}</div>
        </div>
        {/* Tabla scrollable */}
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Total (S/)</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>S/ {order.total}</td>
                  <td>
                    <span className={`status ${order.status.toLowerCase().replace(/_/g, '-')}`}>
                      {order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <button
                      className="btn-details"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal */}
        {selectedOrder && (
          <div className="modal-bg" onClick={() => setSelectedOrder(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Detalles del Pedido</h2>
              <p><strong>ID:</strong> {selectedOrder.id}</p>
              <p><strong>Cliente:</strong> {selectedOrder.customer}</p>
              <p><strong>Total:</strong> S/ {selectedOrder.total}</p>
              <p><strong>Estado:</strong> {selectedOrder.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              <p><strong>Fecha:</strong> {selectedOrder.date}</p>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
