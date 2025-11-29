// src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { EditProfileModal } from "./EditProfileModal";
import "../src/assets/CSS/userProfile.css";


export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [favProducts, setFavProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Cargar usuario y pedidos desde backend ---
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    if (!storedUser || !storedUser.id) {
      return (window.location.href = "/login");
    }
    // Cargar usuario y pedidos
    fetch(`http://localhost/Vivanda/cliente/backend/get_user.php?id=${storedUser.id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.user) {
          setUser(result.user);
          setOrders(result.pedidos || []);
        } else {
          console.error("No se recibió un usuario válido:", result);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar datos:", err);
        setLoading(false);
      });
    // Cargar favoritos (solo IDs)
    fetch(`http://localhost/Vivanda/cliente/backend/favoritos.php?id_usuario=${storedUser.id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'success') {
          setFavoritos(result.favoritos || []);
          // Ahora cargar los productos favoritos completos
          if (result.favoritos && result.favoritos.length > 0) {
            fetch(`http://localhost/Vivanda/cliente/backend/prod_all.php`)
              .then((res) => res.json())
              .then((data) => {
                if (data.status === 'success') {
                  const favs = data.products.filter((p) => result.favoritos.includes(p.id_producto) || result.favoritos.includes(Number(p.id_producto)));
                  setFavProducts(favs);
                }
              });
          } else {
            setFavProducts([]);
          }
        }
      })
      .catch((err) => {
        console.error("Error al cargar favoritos:", err);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (!user) return <div className="text-center text-danger mt-5">No se pudo cargar el perfil.</div>;

  return (
    <>
      <Header />

      <div className="user-profile">
        {/* --- Cabecera con foto y nombre --- */}
        <div className="profile-header">
          <img
            src={
              user.foto_perfil
                ? `http://localhost/Vivanda/cliente/backend/${user.foto_perfil}`
                : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt={`${user.nombres} ${user.apellidos}`}
            className="profile-photo"
          />
          <div className="profile-details">
            <h1>
              {user.nombres} {user.apellidos}
            </h1>
            <p>Miembro desde {user.fecha_registro?.split("-")[0] || "—"}</p>
            <button
              className="edit-btn"
              data-bs-toggle="modal"
              data-bs-target="#editProfileModal"
            >
              Editar información
            </button>
            <EditProfileModal user={user} onUpdate={() => window.location.reload()} />
          </div>
        </div>

        {/* --- Contenido del perfil --- */}
        <div className="profile-content">

          {/* Información personal */}
          <div className="profile-section">
            <h2>Información personal</h2>
            <p><strong>Correo:</strong> {user.correo || user.email}</p>
            <p><strong>Teléfono:</strong> {user.telefono || "No registrado"}</p>
            <p><strong>Dirección:</strong> {user.direccion || "No registrada"}</p>
          </div>

          {/* Mis pedidos recientes */}
          <div className="profile-section">
            <h2>Mis pedidos recientes</h2>
            {orders.length === 0 ? (
              <p>No tienes pedidos aún.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id_pedido} className="order-card">
                  <div className="order-info">
                    <h3>Pedido #{order.id_pedido}</h3>
                    <p><strong>Fecha:</strong> {new Date(order.fecha_pedido).toLocaleDateString()}</p>
                    <p><strong>Estado:</strong> {order.estado.replace("_", " ").toUpperCase()}</p>
                  </div>
                  <div className="order-details">
                    <p><strong>Total:</strong> S/ {order.total}</p>
                    <p>
                      <strong>Productos:</strong>{" "}
                      {order.items?.length
                        ? order.items.map((i) => i.nombre_producto).join(", ")
                        : "No especificado"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Favoritos */}
          <div className="profile-section">
            <h2>Favoritos</h2>
            {favProducts.length === 0 ? (
              <p>No tienes productos favoritos aún.</p>
            ) : (
              <div className="favoritos-list">
                {favProducts.map((fav) => (
                  <div key={fav.id_producto} className="favorito-card">
                    <p style={{margin:0}}>- <strong>{fav.nombre_producto}</strong></p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Métodos de pago */}
          <div className="profile-section">
            <h2>Métodos de pago</h2>
            <p>No tienes tarjetas registradas.</p>
            <button className="add-card-btn" style={{marginTop: '10px', padding: '8px 18px', borderRadius: '8px', background: '#3daf42', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'}}>
              Agregar una tarjeta
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
