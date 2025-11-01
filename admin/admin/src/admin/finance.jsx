import { useState } from "react";
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

const TransactionsData = [
  { id: 1, type: "ingreso", amountPEN: 1200, amountUSD: 320, description: "Venta producto A", category: "Electrónica", date: "2025-10-01" },
  { id: 2, type: "gasto", amountPEN: 400, amountUSD: 105, description: "Compra insumos", category: "Hogar", date: "2025-10-02" },
  { id: 3, type: "ingreso", amountPEN: 800, amountUSD: 210, description: "Venta producto B", category: "Ropa", date: "2025-10-03" },
  { id: 4, type: "gasto", amountPEN: 300, amountUSD: 80, description: "Pago de publicidad", category: "Marketing", date: "2025-10-04" },
  { id: 5, type: "ingreso", amountPEN: 1500, amountUSD: 400, description: "Venta producto C", category: "Electrónica", date: "2025-10-05" },
];

export default function Finance() {
  const [transactions, setTransactions] = useState(TransactionsData);
  const [filter, setFilter] = useState({ type: "all", currency: "PEN", startDate: "", endDate: "" });
  const [editTransaction, setEditTransaction] = useState(null);


  // Filtrado avanzado
  const filteredTransactions = transactions.filter(t => {
    let match = filter.type === "all" ? true : t.type === filter.type;
    if (filter.startDate) match = match && t.date >= filter.startDate;
    if (filter.endDate) match = match && t.date <= filter.endDate;
    return match;
  });

  // Resumen financiero
  const totalIngresosPEN = transactions.filter(t => t.type === "ingreso").reduce((a, b) => a + b.amountPEN, 0);
  const totalGastosPEN = transactions.filter(t => t.type === "gasto").reduce((a, b) => a + b.amountPEN, 0);
  const totalBalancePEN = totalIngresosPEN - totalGastosPEN;
  const totalIngresosUSD = transactions.filter(t => t.type === "ingreso").reduce((a, b) => a + b.amountUSD, 0);
  const totalGastosUSD = transactions.filter(t => t.type === "gasto").reduce((a, b) => a + b.amountUSD, 0);
  const totalBalanceUSD = totalIngresosUSD - totalGastosUSD;

  // Datos para gráficos
  const barData = {
    labels: filteredTransactions.map(t => t.date),
    datasets: [
      {
        label: "Ingresos",
        data: filteredTransactions.map(t => t.type === "ingreso" ? (filter.currency === "PEN" ? t.amountPEN : t.amountUSD) : 0),
        backgroundColor: "rgba(46, 204, 113, 0.7)"
      },
      {
        label: "Gastos",
        data: filteredTransactions.map(t => t.type === "gasto" ? (filter.currency === "PEN" ? t.amountPEN : t.amountUSD) : 0),
        backgroundColor: "rgba(231, 76, 60, 0.7)"
      }
    ]
  };

  const lineData = {
    labels: filteredTransactions.map(t => t.date),
    datasets: [
      {
        label: `Balance (${filter.currency})`,
        data: filteredTransactions.reduce((acc, t) => {
          const last = acc.length > 0 ? acc[acc.length - 1] : 0;
          const value = t.type === "ingreso" ? (filter.currency === "PEN" ? t.amountPEN : t.amountUSD) : -(filter.currency === "PEN" ? t.amountPEN : t.amountUSD);
          acc.push(last + value);
          return acc;
        }, []),
        borderColor: "rgba(52, 152, 219, 1)",
        backgroundColor: "rgba(52, 152, 219, 0.3)",
        tension: 0.3
      }
    ]
  };

  const pieData = {
    labels: [...new Set(transactions.map(t => t.category))],
    datasets: [
      {
        label: "Ingresos por categoría",
        data: [...new Set(transactions.map(t => t.category))].map(cat =>
          transactions.filter(t => t.category === cat && t.type === "ingreso").reduce((a, b) => a + (filter.currency === "PEN" ? b.amountPEN : b.amountUSD), 0)
        ),
        backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c", "#9b59b6"]
      }
    ]
  };

  const handleEdit = (transaction) => setEditTransaction({ ...transaction });
  const handleSave = () => {
    setTransactions(transactions.map(t => t.id === editTransaction.id ? editTransaction : t));
    setEditTransaction(null);
  };
  const handleDelete = (id) => setTransactions(transactions.filter(t => t.id !== id));

  return (
    <div className="layout">
      <Sidebar />

      <div className="finance-content">
        <h1>Finanzas</h1>
        <div className="finance-summary">
          <div className="card">Ingresos: {totalIngresosPEN} PEN / {totalIngresosUSD} USD</div>
          <div className="card">Gastos: {totalGastosPEN} PEN / {totalGastosUSD} USD</div>
          <div className="card">Balance: {totalBalancePEN} PEN / {totalBalanceUSD} USD</div>
          <div className="card">Transacciones: {transactions.length}</div>
        </div>

        {/* Filtros */}
        <div className="finance-filters">
          <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
            <option value="all">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
          <select value={filter.currency} onChange={e => setFilter({ ...filter, currency: e.target.value })}>
            <option value="PEN">Soles (PEN)</option>
            <option value="USD">Dólares (USD)</option>
          </select>
          <input type="date" value={filter.startDate} onChange={e => setFilter({ ...filter, startDate: e.target.value })} />
          <input type="date" value={filter.endDate} onChange={e => setFilter({ ...filter, endDate: e.target.value })} />
        </div>

    
        {/* Gráficos al inicio */}
      <div className="finance-charts">
  <div className="chart-box">
    <h3>Ingresos vs Gastos ({filter.currency})</h3>
    <Bar data={barData} />
  </div>
  <div className="chart-box">
    <h3>Ingresos por Categoría ({filter.currency})</h3>
    <Pie data={pieData} />
  </div>
  <div className="chart-box full-width">
    <h3>Balance Acumulado ({filter.currency})</h3>
    <Line data={lineData} />
  </div>
</div>



        {/* Resumen financiero */}

      </div>
    </div>
  );
}
