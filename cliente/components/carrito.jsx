import { useState, useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import "../src/assets/CSS/cart.css";
import { Link, useNavigate } from "react-router-dom";

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost/Vivanda/cliente/backend/get_cart.php?id_usuario=${usuario.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setCartItems(data.productos);
          setTotal(data.total);
        }
      })
      .catch((err) => console.error("Error cargando carrito:", err));
  }, [navigate]);

  const handleRemove = async (id_producto) => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    try {
      const res = await fetch("http://localhost/Vivanda/cliente/backend/removeCart.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuario.id,
          id_producto: id_producto,
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        setCartItems((prev) => prev.filter((item) => item.id_producto !== id_producto));
        setTotal((prev) => prev - data.precio_eliminado * data.cantidad_eliminada);
      } else {
        alert("Error al eliminar: " + data.message);
      }
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("No se pudo eliminar el producto");
    }
  };

  return (
    <>
      <Header />

      <div className="cart-container">
        <h1>Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Tu carrito está vacío</p>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id_producto} className="cart-item">
                  <img
                    src={item.imagen || "images/productos/default.png"}
                    alt={item.nombre}
                  />
                  <div className="cart-info">
                    <h3>{item.nombre}</h3>
                    <p className="price">S/ {parseFloat(item.precio).toFixed(2)}</p>
                    <span>Cantidad: {item.cantidad}</span>
                    <p className="subtotal">
                      Subtotal: S/ {(item.precio * item.cantidad).toFixed(2)}
                    </p>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.id_producto)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Resumen del pedido</h2>
              <p>Productos: {cartItems.length}</p>
              <p>Total: S/ {total.toFixed(2)}</p>
              <Link to="/checkout">
                <button className="checkout-btn">Continuar con el pago →</button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};
