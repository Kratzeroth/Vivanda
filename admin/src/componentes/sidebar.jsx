import { Link } from "react-router-dom";
import "../assets/css/sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/orders">Pedidos</Link></li>
        <li><Link to="/promotions">Promociones</Link></li>
        <li><Link to="/inventory">Inventario</Link></li>
        <li><Link to="/customers">Clientes</Link></li>
        <li><Link to="/finance">Finanzas</Link></li>
        <li><Link to="/reports">Reportes</Link></li>
        <li><Link to="/categories">Categorías</Link></li>
        <li><Link to="/banners">Banners</Link></li>
        <li><Link to="/users">Usuarios</Link></li>
        <li><Link to="/settings">Configuración</Link></li>
      </ul>
    </div>
  );
}
