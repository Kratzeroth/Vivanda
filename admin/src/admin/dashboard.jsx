import { useState, useEffect } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
} from "chart.js";
import "../assets/css/dashboard.css";

// Registro de elementos de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

// Tema oscuro por defecto para todos los gráficos
ChartJS.defaults.color = "#fff";
ChartJS.defaults.borderColor = "#444";

export default function Dashboard() {
  // Estados para los filtros
  const [month, setMonth] = useState("Enero");
  const [year, setYear] = useState("2025");

  // Datos de ventas por mes (simulados, se podrían filtrar según mes/año)
  const salesData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Ventas ($)",
        data: [1200, 1900, 3000, 2500, 3200, 4100],
        backgroundColor: "rgba(0, 123, 255, 0.3)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 123, 255, 1)"
      }
    ]
  };

  const conversionData = {
    labels: ["Visitantes", "Compradores"],
    datasets: [
      {
        label: "Tasa de Conversión (%)",
        data: [1000, 120],
        backgroundColor: ["rgba(255, 193, 7,0.6)", "rgba(54, 162, 235,0.6)"],
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  const avgOrder = {
    labels: ["Valor Promedio Compra ($)"],
    datasets: [
      {
        label: "Valor Promedio Pedido",
        data: [75],
        backgroundColor: ["rgba(103, 58, 183,0.6)"],
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  const abandonedCart = {
    labels: ["Completadas", "Abandonadas"],
    datasets: [
      {
        label: "Carritos Abandonados (%)",
        data: [45, 20],
        backgroundColor: ["rgba(0, 200, 83,0.6)", "rgba(233, 30, 99,0.6)"],
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  const cacData = {
    labels: ["Gasto Marketing", "Clientes Nuevos"],
    datasets: [
      {
        label: "CAC ($)",
        data: [1200, 30],
        backgroundColor: ["rgba(255, 87, 34,0.6)", "rgba(54, 162, 235,0.6)"],
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  const topProducts = {
    labels: ["Laptop", "Audífonos", "Mouse", "Teclado", "Monitor"],
    datasets: [
      {
        label: "Más vendidos",
        data: [150, 120, 100, 80, 70],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ],
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  const trafficData = {
    labels: ["Google", "Instagram", "Email", "Orgánico"],
    datasets: [
      {
        label: "Fuentes de Tráfico",
        data: [400, 250, 150, 200],
        backgroundColor: [
          "rgba(0, 123, 255, 0.6)",
          "rgba(255, 193, 7, 0.6)",
          "rgba(103, 58, 183,0.6)",
          "rgba(0, 200, 83,0.6)"
        ],
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  const marginData = {
    labels: ["Margen Bruto (%)"],
    datasets: [
      {
        label: "Rentabilidad",
        data: [65],
        backgroundColor: ["rgba(0, 200, 83,0.6)"],
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  const retentionData = {
    labels: ["Clientes Nuevos", "Clientes Recurrentes"],
    datasets: [
      {
        label: "Fidelidad y Retorno (%)",
        data: [120, 80],
        backgroundColor: ["rgba(54, 162, 235,0.6)", "rgba(255, 99, 132,0.6)"],
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  const returnsData = {
    labels: ["Devueltos", "Entregados"],
    datasets: [
      {
        label: "Devoluciones (%)",
        data: [5, 95],
        backgroundColor: ["rgba(233, 30, 99,0.6)", "rgba(0, 123, 255,0.6)"],
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  // Renderizado del Dashboard
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <h1>Panel de Control</h1>

        {/* FILTROS */}
        <div className="filters">
          <label>
            Mes:
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              {["Enero","Febrero","Marzo","Abril","Mayo","Junio"].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <label>
            Año:
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {["2025","2024","2023"].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>

        {/* CARDS DE ESTADÍSTICAS */}
        <div className="stats-grid">
          <div className="card blue">Productos: 220</div>
          <div className="card green">Usuarios Activos: 1200</div>
          <div className="card orange">Pedidos Hoy: 45</div>
          <div className="card grey">Ganancia del día: $980</div>
        </div>

        {/* GRÁFICOS */}
        <div className="charts-grid">
          <div className="chart-box">
            <h3>Resumen Financiero y de Ingresos</h3>
            <Line data={salesData} />
          </div>

          <div className="chart-box">
            <h3>Rendimiento del Embudo de Venta</h3>
            <Bar data={conversionData} />
          </div>

          <div className="chart-box">
            <h3>Valor Promedio de Compra</h3>
            <Bar data={avgOrder} />
          </div>

          <div className="chart-box">
            <h3>Análisis de Carritos Abandonados</h3>
            <Doughnut data={abandonedCart} />
          </div>

          <div className="chart-box">
            <h3>Costo por Nuevo Cliente (CAC)</h3>
            <Bar data={cacData} />
          </div>

          <div className="chart-box">
            <h3>Productos Estrella y Stock</h3>
            <Bar data={topProducts} />
          </div>

          <div className="chart-box">
            <h3>Fuentes de Tráfico y Origen de Ventas</h3>
            <Bar data={trafficData} />
          </div>

          <div className="chart-box">
            <h3>Rentabilidad por Venta</h3>
            <Bar data={marginData} />
          </div>

          <div className="chart-box">
            <h3>Fidelidad y Retorno de Clientes</h3>
            <Bar data={retentionData} />
          </div>

          <div className="chart-box">
            <h3>Gestión y Tasas de Devoluciones</h3>
            <Doughnut data={returnsData} />
          </div>
        </div>

        {/* DETALLE DE INFORMACIÓN ADICIONAL SIMULADA PARA EXTENDER EL CÓDIGO */}
        <div className="extra-info">
          <h2>Información Extendida por Filtro</h2>
          <p>Mes seleccionado: {month}</p>
          <p>Año seleccionado: {year}</p>
          <p>Esta sección puede mostrar tablas o detalles adicionales filtrados según mes y año.</p>

          <div className="extra-cards">
            <div className="card blue">Visitas Web: 5400</div>
            <div className="card green">Suscripciones: 320</div>
            <div className="card orange">Comentarios: 80</div>
            <div className="card grey">Tickets Soporte: 15</div>
          </div>
        </div>

       
      </div>
    </div>
  );
}
