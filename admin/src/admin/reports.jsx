import { useState, useEffect } from "react";
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

  // Estados para datos reales
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost/Vivanda/admin/backend/orders.php").then(r => r.json()),
      fetch("http://localhost/Vivanda/admin/backend/productos.php").then(r => r.json()),
      fetch("http://localhost/Vivanda/admin/backend/customers.php").then(r => r.json()),
      fetch("http://localhost/Vivanda/admin/backend/categories.php").then(r => r.json()),
      fetch("http://localhost/Vivanda/admin/backend/promotions.php").then(r => r.json()),
      fetch("http://localhost/Vivanda/admin/backend/inventory.php").then(r => r.json()),
      fetch("http://localhost/Vivanda/admin/backend/users.php").then(r => r.json()),
      fetch("http://localhost/Vivanda/admin/backend/pedido_detalle.php").then(r => r.json())
    ]).then(([orders, products, customers, categories, promotions, inventory, users, detalles]) => {
      setOrders(Array.isArray(orders) ? orders : []);
      setProducts(Array.isArray(products) ? products : []);
      setCustomers(Array.isArray(customers) ? customers : []);
      setCategories(Array.isArray(categories) ? categories : []);
      setPromotions(Array.isArray(promotions) ? promotions : []);
      setInventory(Array.isArray(inventory) ? inventory : []);
      setUsers(Array.isArray(users) ? users : []);
      setDetalles(Array.isArray(detalles) ? detalles : []);
      setError(null);
    }).catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, []);

  // Unificar datos para la tabla y gráficos
  const transactions = orders.flatMap(o => {
    // Buscar detalles de productos para este pedido
    const detallesPedido = detalles.filter(d => d.id_pedido === o.id);
    if (detallesPedido.length === 0) {
      return [{
        id: o.id,
        type: "ingreso",
        amount: o.total,
        category: "Sin categoría",
        customer: o.customer,
        date: o.date,
        product: "-"
      }];
    }
    // Si hay varios productos, crear una fila por producto
    return detallesPedido.map(d => ({
      id: o.id,
      type: "ingreso",
      amount: (d.precio_unitario * d.cantidad),
      category: d.nombre_categoria || "Sin categoría",
      customer: o.customer,
      date: o.date,
      product: d.nombre_producto || "-"
    }));
  });
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

  // Gráficos de reportes con datos reales
  const salesData = {
    labels: filteredTransactions.map(t => t.date),
    datasets: [
      {
        label: "Ingresos",
        data: filteredTransactions.map(t => t.amount),
        backgroundColor: "rgba(46,204,113,0.7)"
      }
    ]
  };

  const categoryList = [...new Set(transactions.map(t => t.category))];
  const categoryData = {
    labels: categoryList,
    datasets: [
      {
        label: "Ventas por Categoría",
        data: categoryList.map(cat =>
          transactions.filter(t => t.category === cat).reduce((a,b) => a+b.amount, 0)
        ),
        backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c", "#9b59b6", "#34495e", "#fdcb6e"]
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
          acc.push(last + t.amount);
          return acc;
        }, []),
        borderColor: "#3498db",
        backgroundColor: "rgba(52,152,219,0.3)",
        tension: 0.3
      }
    ]
  };

  // Productos más vendidos
  const productCount = {};
  transactions.forEach(t => {
    if (!productCount[t.product]) productCount[t.product] = 0;
    productCount[t.product] += 1;
  });
  const topProducts = Object.entries(productCount).sort((a,b) => b[1]-a[1]).slice(0,5);
  const topProductsData = {
    labels: topProducts.map(([name]) => name),
    datasets: [
      {
        label: "Productos más vendidos",
        data: topProducts.map(([_, count]) => count),
        backgroundColor: ["#e74c3c","#2ecc71","#3498db","#f1c40f","#9b59b6"]
      }
    ]
  };

  // Clientes más activos
  const customerCount = {};
  transactions.forEach(t => {
    if (!customerCount[t.customer]) customerCount[t.customer] = 0;
    customerCount[t.customer] += 1;
  });
  const topCustomers = Object.entries(customerCount).sort((a,b) => b[1]-a[1]).slice(0,5);
  const topCustomersData = {
    labels: topCustomers.map(([name]) => name),
    datasets: [
      {
        label: "Clientes más activos",
        data: topCustomers.map(([_, count]) => count),
        backgroundColor: ["#3498db","#2ecc71","#f1c40f","#e74c3c","#9b59b6"]
      }
    ]
  };

  // Inventario
  const inventoryLabels = inventory.map(i => i.nombre_producto);
  const inventoryData = {
    labels: inventoryLabels,
    datasets: [
      {
        label: "Stock Disponible",
        data: inventory.map(i => i.stock || 0),
        backgroundColor: "rgba(241,196,15,0.6)"
      }
    ]
  };

  // Pedidos pendientes/completados/cancelados
  let pendientes = 0, completadas = 0, canceladas = 0;
  orders.forEach(o => {
    if (o.status === "Pendiente") pendientes++;
    else if (o.status === "Entregado" || o.status === "Completado") completadas++;
    else if (o.status === "Cancelado") canceladas++;
  });
  const pendingOrdersData = {
    labels: ["Pendientes", "Completadas", "Canceladas"],
    datasets: [
      {
        label: "Pedidos",
        data: [pendientes, completadas, canceladas],
        backgroundColor: ["#e74c3c","#2ecc71","#3498db"]
      }
    ]
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="reports-content">
        <h1>Reportes E-commerce</h1>
        <div className="reports-filters">
          <select value={filter.type} onChange={e=>setFilter({...filter,type:e.target.value})}>
            <option value="all">Todos</option>
            <option value="ingreso">Ingresos</option>
          </select>
          <select value={filter.category} onChange={e=>setFilter({...filter,category:e.target.value})}>
            <option value="all">Todas Categorías</option>
            {categoryList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input type="date" value={filter.startDate} onChange={e=>setFilter({...filter,startDate:e.target.value})} />
          <input type="date" value={filter.endDate} onChange={e=>setFilter({...filter,endDate:e.target.value})} />
          <input type="number" placeholder="Monto min" value={filter.minAmount} onChange={e=>setFilter({...filter,minAmount:e.target.value})}/>
          <input type="number" placeholder="Monto max" value={filter.maxAmount} onChange={e=>setFilter({...filter,maxAmount:e.target.value})}/>
        </div>
        {loading ? (
          <div className="loading">Cargando datos...</div>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : (
        <>
        <div className="reports-charts">
          <div className="chart-box">
            <h3>Ingresos</h3>
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
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Cliente</th>
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
        </>
        )}
      </div>
    </div>
  );
}
