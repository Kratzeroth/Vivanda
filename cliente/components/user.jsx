// src/pages/UserProfile.jsx
import { Header } from "./header";
import { Footer } from "./footer";
import "../src/assets/CSS/userProfile.css";

export const UserProfile = () => {
  const user = {
    name: "Diego Tataje",
    email: "diego.tataje@example.com",
    phone: "+51 987 654 321",
    address: "Av. Primavera 123, Lima, Perú",
    memberSince: "2021",
    profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const orders = [
    {
      id: "ORD-2025-001",
      date: "20/10/2025",
      total: "S/ 124.90",
      status: "Entregado",
      items: ["Café Orgánico", "Pan Integral", "Leche Deslactosada"],
    },
    {
      id: "ORD-2025-002",
      date: "15/10/2025",
      total: "S/ 68.50",
      status: "En camino",
      items: ["Queso Andino", "Yogurt Griego"],
    },
  ];

  return (
    <>
      <Header />

      <div className="user-profile">
        <div className="profile-header">
          <img src={user.profilePhoto} alt={user.name} className="profile-photo" />
          <div className="profile-details">
            <h1>{user.name}</h1>
            <p>Miembro desde {user.memberSince}</p>
            <button className="edit-btn">Editar información</button>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Información personal</h2>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>Teléfono:</strong> {user.phone}</p>
            <p><strong>Dirección:</strong> {user.address}</p>
          </div>

          <div className="profile-section">
            <h2>Mis pedidos recientes</h2>
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-info">
                  <h3>{order.id}</h3>
                  <p><strong>Fecha:</strong> {order.date}</p>
                  <p><strong>Estado:</strong> {order.status}</p>
                </div>
                <div className="order-details">
                  <p><strong>Total:</strong> {order.total}</p>
                  <p><strong>Productos:</strong> {order.items.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="profile-section">
            <h2>Favoritos</h2>
            <p>Aquí aparecerán tus productos guardados como favoritos.</p>
          </div>

          <div className="profile-section">
            <h2>Métodos de pago</h2>
            <p>No tienes tarjetas registradas.</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
