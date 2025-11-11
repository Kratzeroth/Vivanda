import { useState, useEffect } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import "../assets/css/finance.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


export default function Finance() {
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [errorPayments, setErrorPayments] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Consultar pagos
    setLoadingPayments(true);
    fetch("http://localhost/Vivanda/admin/backend/payments.php")
      .then(res => res.json())
      .then(data => {
        setPayments(Array.isArray(data) ? data : []);
        setErrorPayments(null);
      })
      .catch(() => setErrorPayments("Error al cargar pagos"))
      .finally(() => setLoadingPayments(false));
        <div className="chart-box chart-modern">
          <h3 className="chart-title gradient-text">Pagos realizados</h3>
          {loadingPayments ? (
            <div className="loading">Cargando pagos...</div>
          ) : errorPayments ? (
            <div className="error-msg">{errorPayments}</div>
          ) : (
            <table className="finance-table">
              <thead>
                <tr>
                  <th>ID Pago</th>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Fecha</th>
                  <th>Estado Pedido</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 10).map(p => (
                  <tr key={p.id_pago}>
                    <td>{p.id_pago}</td>
                    <td>{p.id_pedido}</td>
                    <td>{p.cliente}</td>
                    <td>${parseFloat(p.monto).toFixed(2)}</td>
                    <td>{p.metodo}</td>
                    <td>{p.fecha_pago}</td>
                    <td>{p.estado_pedido}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    setLoading(true);
    fetch("http://localhost/Vivanda/admin/backend/orders.php")
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError("Error al cargar ventas"))
      .finally(() => setLoading(false));
  }, []);

  // Mostrar todos los pedidos y ventas sin filtrar por mes/año
  const ventasFiltradas = orders;
  const totalVentas = ventasFiltradas.reduce((acc, o) => acc + parseFloat(o.total || 0), 0);


  // Gráfico de ventas por mes
  const salesLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const salesByMonth = Array(12).fill(0);
  orders.forEach(order => {
    const fecha = new Date(order.date || order.fecha_pedido);
    const mes = fecha.getMonth();
    salesByMonth[mes] += parseFloat(order.total || 0);
  });
  const salesData = {
    labels: salesLabels,
    datasets: [
      {
        label: "Ventas ($)",
        data: salesByMonth,
        backgroundColor: "rgba(0, 123, 255, 0.3)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 123, 255, 1)"
      }
    ]
  };


  return (
    <div className="layout">
      <Sidebar />
      <div className="finance-content">
        <h1>Finanzas</h1>
        <div className="finance-summary">
          <div className="card" style={{ background: '#007bff' }}>Ventas totales: ${totalVentas.toFixed(2)}</div>
          <div className="card" style={{ background: '#b36a00' }}>Pedidos: {ventasFiltradas.length}</div>
        </div>
        <div className="finance-charts">
          <div className="chart-box">
            <h3>Ventas por Mes</h3>
            <Pie data={{
              labels: salesLabels,
              datasets: [
                {
                  label: "Ventas ($)",
                  data: salesByMonth,
                  backgroundColor: [
                    "#007bff", "#00c6ff", "#2ecc71", "#f1c40f", "#e67e22", "#e74c3c",
                    "#9b59b6", "#34495e", "#1abc9c", "#fd79a8", "#636e72", "#fdcb6e"
                  ]
                }
              ]
            }} />
          </div>
        </div>
        <div className="finance-table-wrapper">
          <h3>Pedidos recientes</h3>
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : error ? (
            <div className="error-msg">{error}</div>
          ) : (
            <table className="finance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total ($)</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.slice(0, 10).map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.date || o.fecha_pedido}</td>
                    <td>${parseFloat(o.total || 0).toFixed(2)}</td>
                    <td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
