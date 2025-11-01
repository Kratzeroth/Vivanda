import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/orders.css";

const initialOrders = [
  { id: 1001, customer: "Juan Pérez", total: 250, status: "Pendiente", date: "2025-01-15" },
  { id: 1002, customer: "Ana Torres", total: 780, status: "Completado", date: "2025-01-14" },
  { id: 1003, customer: "Carlos Díaz", total: 120, status: "Cancelado", date: "2025-01-13" },
  { id: 1004, customer: "María López", total: 430, status: "Pendiente", date: "2025-01-12" },
 { id: 1001, customer: "Juan Pérez", total: 250, status: "Pendiente", date: "2025-01-15" },
  { id: 1002, customer: "Ana Torres", total: 780, status: "Completado", date: "2025-01-14" },
  { id: 1003, customer: "Carlos Díaz", total: 120, status: "Cancelado", date: "2025-01-13" },
  { id: 1004, customer: "María López", total: 430, status: "Pendiente", date: "2025-01-12" },
 { id: 1001, customer: "Juan Pérez", total: 250, status: "Pendiente", date: "2025-01-15" },
  { id: 1002, customer: "Ana Torres", total: 780, status: "Completado", date: "2025-01-14" },
  { id: 1003, customer: "Carlos Díaz", total: 120, status: "Cancelado", date: "2025-01-13" },
  { id: 1004, customer: "María López", total: 430, status: "Pendiente", date: "2025-01-12" },
 { id: 1001, customer: "Juan Pérez", total: 250, status: "Pendiente", date: "2025-01-15" },
  { id: 1002, customer: "Ana Torres", total: 780, status: "Completado", date: "2025-01-14" },
  { id: 1003, customer: "Carlos Díaz", total: 120, status: "Cancelado", date: "2025-01-13" },
  { id: 1004, customer: "María López", total: 430, status: "Pendiente", date: "2025-01-12" },
 { id: 1001, customer: "Juan Pérez", total: 250, status: "Pendiente", date: "2025-01-15" },
  { id: 1002, customer: "Ana Torres", total: 780, status: "Completado", date: "2025-01-14" },
  { id: 1003, customer: "Carlos Díaz", total: 120, status: "Cancelado", date: "2025-01-13" },
  { id: 1004, customer: "María López", total: 430, status: "Pendiente", date: "2025-01-12" },

];

export default function Orders() {
  const [orders] = useState(initialOrders);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);


  const filteredOrders = orders.filter(order => 
    (filter === "Todos" || order.status === filter) &&
    (order.customer.toLowerCase().includes(search.toLowerCase()) || 
     order.id.toString().includes(search))
  );

  // Contadores por estado
  const countPendiente = orders.filter(o => o.status === "Pendiente").length;
  const countCompletado = orders.filter(o => o.status === "Completado").length;
  const countCancelado = orders.filter(o => o.status === "Cancelado").length;

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
            <option>Completado</option>
            <option>Cancelado</option>
          </select>
        </div>

        {/* Cuadros de resumen por estado */}
        <div className="orders-summary">
          <div className="summary-box pendiente">Pendientes: {countPendiente}</div>
          <div className="summary-box completado">Completados: {countCompletado}</div>
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
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
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
              <p><strong>Estado:</strong> {selectedOrder.status}</p>
              <p><strong>Fecha:</strong> {selectedOrder.date}</p>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
