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
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [promotions, setPromotions] = useState([]);
  // Estados para los filtros
  const [month, setMonth] = useState("Enero");
  const [year, setYear] = useState("2025");

  // Estados para datos reales
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost/Vivanda/admin/backend/orders.php").then(res => res.json()),
      fetch("http://localhost/Vivanda/admin/backend/productos.php").then(res => res.json()),
      fetch("http://localhost/Vivanda/admin/backend/users.php").then(res => res.json()),
      fetch("http://localhost/Vivanda/admin/backend/customers.php").then(res => res.json()),
      fetch("http://localhost/Vivanda/admin/backend/inventory.php").then(res => res.json()),
      fetch("http://localhost/Vivanda/admin/backend/categories.php").then(res => res.json()),
      fetch("http://localhost/Vivanda/admin/backend/banners.php").then(res => res.json()),
      fetch("http://localhost/Vivanda/admin/backend/promotions.php").then(res => res.json())
    ]).then(([ordersData, productsData, usersData, customersData, inventoryData, categoriesData, bannersData, promotionsData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setBanners(Array.isArray(bannersData) ? bannersData : []);
      setPromotions(Array.isArray(promotionsData) ? promotionsData : []);
      setError(null);
    }).catch(() => {
      setError("Error al cargar datos del dashboard");
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // Datos de ventas por mes (reales)
  const salesLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const salesByMonth = Array(12).fill(0);
  orders.forEach(order => {
    const fecha = new Date(order.fecha_pedido);
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

  // Productos por categoría
  const categoryCounts = categories.map(cat => {
    return products.filter(p => p.nombre_categoria === cat.nombre_categoria).length;
  });
  const categoryData = {
    labels: categories.map(cat => cat.nombre_categoria),
    datasets: [
      {
        label: "Productos por Categoría",
        data: categoryCounts,
        backgroundColor: categories.map((_, i) => `rgba(${50+i*30}, ${100+i*20}, ${200-i*10}, 0.6)`),
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  // Promociones activas
  const activePromos = promotions.filter(p => p.activo);
  const promoData = {
    labels: activePromos.map(p => p.titulo),
    datasets: [
      {
        label: "Promociones activas",
        data: activePromos.map(p => p.descuento_porcentaje || 0),
        backgroundColor: activePromos.map((_, i) => `rgba(${200-i*20}, ${50+i*30}, ${100+i*20}, 0.6)`),
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };

  // Banners activos
  const activeBanners = banners.filter(b => b.activo);
  const bannerData = {
    labels: activeBanners.map(b => b.titulo),
    datasets: [
      {
        label: "Banners activos",
        data: activeBanners.map(() => 1),
        backgroundColor: activeBanners.map((_, i) => `rgba(${100+i*30}, ${200-i*10}, ${50+i*20}, 0.6)`),
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1
      }
    ]
  };


  // Clientes por mes
  const clientesPorMes = Array(12).fill(0);
  customers.forEach(c => {
    const fecha = new Date(c.fecha_registro);
    const mes = fecha.getMonth();
    clientesPorMes[mes]++;
  });
  const clientesData = {
    labels: salesLabels,
    datasets: [
      {
        label: "Clientes registrados",
        data: clientesPorMes,
        backgroundColor: "rgba(54, 162, 235,0.6)",
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
          <div className="card blue">Productos: {products.length}</div>
          <div className="card green">Usuarios: {users.length}</div>
          <div className="card orange">Pedidos: {orders.length}</div>
          <div className="card grey">Clientes: {customers.length}</div>
          <div className="card purple">Categorías: {categories.length}</div>
          <div className="card yellow">Banners: {banners.length}</div>
          <div className="card pink">Promociones: {promotions.length}</div>
        </div>

        {loading ? (
          <div className="loading">Cargando datos...</div>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : (
          <div className="charts-grid">
            <div className="chart-box">
              <h3>Ventas por Mes</h3>
              <Line data={salesData} />
            </div>
            <div className="chart-box">
              <h3>Productos por Categoría</h3>
              <Bar data={categoryData} />
            </div>
            <div className="chart-box">
              <h3>Promociones Activas</h3>
              <Bar data={promoData} />
            </div>
            <div className="chart-box">
              <h3>Banners Activos</h3>
              <Bar data={bannerData} />
            </div>
            <div className="chart-box">
              <h3>Clientes Registrados por Mes</h3>
              <Line data={clientesData} />
            </div>
          </div>
        )}

        {/* DETALLE DE INFORMACIÓN ADICIONAL SIMULADA PARA EXTENDER EL CÓDIGO */}
        <div className="extra-info">
          <h2>Información Extendida por Filtro</h2>
          <p>Mes seleccionado: {month}</p>
          <p>Año seleccionado: {year}</p>

          {/* Filtrar datos por mes y año */}
          {(() => {
            const mesIndex = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].indexOf(month);
            const anioNum = parseInt(year);
            // Pedidos filtrados
            const pedidosFiltrados = orders.filter(o => {
              const fecha = new Date(o.date || o.fecha_pedido);
              return fecha.getMonth() === mesIndex && fecha.getFullYear() === anioNum;
            });
            // Clientes filtrados
            const clientesFiltrados = customers.filter(c => {
              const fecha = new Date(c.fecha_registro);
              return fecha.getMonth() === mesIndex && fecha.getFullYear() === anioNum;
            });
            // Total ventas
            const totalVentas = pedidosFiltrados.reduce((acc, o) => acc + parseFloat(o.total || 0), 0);
            // Productos vendidos (simulado: cantidad de pedidos)
            const productosVendidos = pedidosFiltrados.length;
            return (
              <div className="extra-cards">
                <div className="card blue">Pedidos: {pedidosFiltrados.length}</div>
                <div className="card green">Clientes registrados: {clientesFiltrados.length}</div>
                <div className="card orange">Ventas totales: ${totalVentas.toFixed(2)}</div>
                <div className="card grey">Productos vendidos: {productosVendidos}</div>
              </div>
            );
          })()}
        </div>

       
      </div>
    </div>
  );
}
