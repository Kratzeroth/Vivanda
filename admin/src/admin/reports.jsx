import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import { Bar, Line, Doughnut, Radar, Pie } from "react-chartjs-2";
import "../assets/css/reports.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title
);

export default function Reports() {
  const [filter, setFilter] = useState({
    type: "all",
    startDate: "",
    endDate: "",
    category: "all",
    currency: "USD",
    minAmount: "",
    maxAmount: ""
  });

  // Datos inventados de ejemplo
  const transactions = [
    { id: 1, type: "ingreso", amount: 1200, category: "Electrónica", customer: "Juan", date: "2025-10-01", product: "Laptop" },
    { id: 2, type: "gasto", amount: 400, category: "Hogar", customer: "Proveedor A", date: "2025-10-02", product: "Silla" },
    { id: 3, type: "ingreso", amount: 800, category: "Ropa", customer: "María", date: "2025-10-03", product: "Camiseta" },
    { id: 4, type: "ingreso", amount: 1500, category: "Electrónica", customer: "Pedro", date: "2025-10-05", product: "Laptop" },
    { id: 5, type: "gasto", amount: 300, category: "Marketing", customer: "Agencia X", date: "2025-10-06", product: "Publicidad" },
    { id: 6, type: "ingreso", amount: 700, category: "Hogar", customer: "Ana", date: "2025-10-07", product: "Mesa" },
    { id: 7, type: "ingreso", amount: 1200, category: "Ropa", customer: "Luis", date: "2025-10-08", product: "Pantalón" },
  ];

  // Filtrado avanzado
  const filteredTransactions = transactions.filter(t => {
    let match = filter.type === "all" ? true : t.type === filter.type;
    match = match && (filter.category === "all" ? true : t.category === filter.category);
    if (filter.startDate) match = match && t.date >= filter.startDate;
    if (filter.endDate) match = match && t.date <= filter.endDate;
    if (filter.minAmount) match = match && t.amount >= Number(filter.minAmount);
    if (filter.maxAmount) match = match && t.amount <= Number(filter.maxAmount);
    return match;
  });

  // Gráficos de reportes
  const salesData = {
    labels: filteredTransactions.map(t => t.date),
    datasets: [
      {
        label: "Ingresos",
        data: filteredTransactions.map(t => t.type === "ingreso" ? t.amount : 0),
        backgroundColor: "rgba(46,204,113,0.7)"
      },
      {
        label: "Gastos",
        data: filteredTransactions.map(t => t.type === "gasto" ? t.amount : 0),
        backgroundColor: "rgba(231,76,60,0.7)"
      }
    ]
  };

  const categoryData = {
    labels: [...new Set(transactions.map(t => t.category))],
    datasets: [
      {
        label: "Ventas por Categoría",
        data: [...new Set(transactions.map(t => t.category))].map(cat =>
          transactions.filter(t => t.category === cat && t.type === "ingreso").reduce((a,b) => a+b.amount, 0)
        ),
        backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c", "#9b59b6"]
      }
    ]
  };

  const balanceData = {
    labels: filteredTransactions.map(t => t.date),
    datasets: [
      {
        label: "Balance Acumulado",
        data: filteredTransactions.reduce((acc,t) => {
          const last = acc.length > 0 ? acc[acc.length-1] : 0;
          const val = t.type === "ingreso" ? t.amount : -t.amount;
          acc.push(last+val);
          return acc;
        }, []),
        borderColor: "#3498db",
        backgroundColor: "rgba(52,152,219,0.3)",
        tension: 0.3
      }
    ]
  };

  const topProductsData = {
    labels: ["Laptop", "Camiseta", "Mesa", "Pantalón", "Silla"],
    datasets: [
      {
        label: "Productos más vendidos",
        data: [2,1,1,1,1],
        backgroundColor: ["#e74c3c","#2ecc71","#3498db","#f1c40f","#9b59b6"]
      }
    ]
  };

  const topCustomersData = {
    labels: ["Juan", "María", "Pedro", "Ana", "Luis"],
    datasets: [
      {
        label: "Clientes más activos",
        data: [1,1,1,1,1],
        backgroundColor: ["#3498db","#2ecc71","#f1c40f","#e74c3c","#9b59b6"]
      }
    ]
  };

  const inventoryData = {
    labels: ["Laptop", "Auriculares", "Mouse", "Teclado", "Monitor"],
    datasets: [
      {
        label: "Stock Disponible",
        data: [30, 50, 70, 40, 25],
        backgroundColor: "rgba(241,196,15,0.6)"
      }
    ]
  };

  const pendingOrdersData = {
    labels: ["Pendientes", "Completadas", "Canceladas"],
    datasets: [
      {
        label: "Pedidos",
        data: [5,12,2],
        backgroundColor: ["#e74c3c","#2ecc71","#3498db"]
      }
    ]
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="reports-content">
        <h1>Reportes E-commerce</h1>

        {/* Filtros */}
        <div className="reports-filters">
          <select value={filter.type} onChange={e=>setFilter({...filter,type:e.target.value})}>
            <option value="all">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
          <select value={filter.category} onChange={e=>setFilter({...filter,category:e.target.value})}>
            <option value="all">Todas Categorías</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Ropa">Ropa</option>
            <option value="Hogar">Hogar</option>
            <option value="Marketing">Marketing</option>
          </select>
          <input type="date" value={filter.startDate} onChange={e=>setFilter({...filter,startDate:e.target.value})} />
          <input type="date" value={filter.endDate} onChange={e=>setFilter({...filter,endDate:e.target.value})} />
          <input type="number" placeholder="Monto min" value={filter.minAmount} onChange={e=>setFilter({...filter,minAmount:e.target.value})}/>
          <input type="number" placeholder="Monto max" value={filter.maxAmount} onChange={e=>setFilter({...filter,maxAmount:e.target.value})}/>
        </div>

        {/* Gráficos */}
        <div className="reports-charts">
          <div className="chart-box">
            <h3>Ingresos vs Gastos</h3>
            <Bar data={salesData} />
          </div>

          <div className="chart-box">
            <h3>Ventas por Categoría</h3>
            <Doughnut data={categoryData} />
          </div>

          <div className="chart-box full-width">
            <h3>Balance Acumulado</h3>
            <Line data={balanceData} />
          </div>

          <div className="chart-box">
            <h3>Productos Más Vendidos</h3>
            <Bar data={topProductsData} />
          </div>

          <div className="chart-box">
            <h3>Clientes Más Activos</h3>
            <Bar data={topCustomersData} />
          </div>

          <div className="chart-box">
            <h3>Inventario</h3>
            <Bar data={inventoryData} />
          </div>

          <div className="chart-box">
            <h3>Pedidos Pendientes</h3>
            <Pie data={pendingOrdersData} />
          </div>
        </div>

        {/* Tabla de transacciones */}
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Cliente/Proveedor</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t=>(
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.product}</td>
                  <td>{t.category}</td>
                  <td>{t.type}</td>
                  <td>{t.customer}</td>
                  <td>{t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
