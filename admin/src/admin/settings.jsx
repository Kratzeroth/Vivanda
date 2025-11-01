import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/settings.css";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    orders: true,
    messages: false,
    updates: true,
  });

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="settings-content">
        <h1>Configuración</h1>

        {/* Notificaciones */}
        <section className="settings-section">
          <h2>Notificaciones</h2>
          <div className="settings-item">
            <label>
              <input
                type="checkbox"
                checked={notifications.orders}
                onChange={() => toggleNotification("orders")}
              />
              Pedidos
            </label>
          </div>
          <div className="settings-item">
            <label>
              <input
                type="checkbox"
                checked={notifications.messages}
                onChange={() => toggleNotification("messages")}
              />
              Mensajes de clientes
            </label>
          </div>
          <div className="settings-item">
            <label>
              <input
                type="checkbox"
                checked={notifications.updates}
                onChange={() => toggleNotification("updates")}
              />
              Actualizaciones del sistema
            </label>
          </div>
        </section>

        {/* Roles y permisos */}
        <section className="settings-section">
          <h2>Roles y Permisos</h2>
          <table className="settings-table">
            <thead>
              <tr>
                <th>Rol</th>
                <th>Crear</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Administrador</td>
                <td><input type="checkbox" checked readOnly /></td>
                <td><input type="checkbox" checked readOnly /></td>
                <td><input type="checkbox" checked readOnly /></td>
              </tr>
              <tr>
                <td>Editor</td>
                <td><input type="checkbox" checked /></td>
                <td><input type="checkbox" checked /></td>
                <td><input type="checkbox" /></td>
              </tr>
              <tr>
                <td>Usuario</td>
                <td><input type="checkbox" /></td>
                <td><input type="checkbox" /></td>
                <td><input type="checkbox" /></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Herramientas del sistema */}
        <section className="settings-section">
          <h2>Herramientas del Sistema</h2>
          <div className="settings-item">
            <button className="btn">Respaldar Base de Datos</button>
          </div>
          <div className="settings-item">
            <button className="btn btn-danger">Reiniciar Sistema</button>
          </div>
          <div className="settings-item">
            <button className="btn btn-warning">Limpiar Cache</button>
          </div>
        </section>
      </div>
    </div>
  );
}
