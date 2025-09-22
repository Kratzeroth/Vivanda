// src/pages/Cart.jsx
import { useState } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import "../src/assets/CSS/cart.css";
import { Link } from "react-router-dom";

export const Cart = () => {
  // Simulación de datos (como si viniera del backend PHP)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Café Orgánico 500g",
      price: 25.9,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
      quantity: 1,
      store: "Vivanda - Café & Bebidas",
    },
    {
      id: 2,
      name: "Manzanas Fuji (1kg)",
      price: 12.5,
      image:
        "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80",
      quantity: 2,
      store: "Vivanda - Frutas & Verduras",
    },
  ]);

  // Funciones para aumentar/disminuir cantidad
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Eliminar producto
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calcular total
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Header />

      <div className="cart-container">
        <h1>🛒 Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Tu carrito está vacío</p>
        ) : (
          <div className="cart-content">
            {/* Lista de productos */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p className="store">{item.store}</p>
                    <p className="price">S/ {item.price.toFixed(2)}</p>

                    {/* Controles de cantidad */}
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="subtotal">
                      Subtotal: S/ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Eliminar */}
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="cart-summary">
              <h2>Resumen del pedido</h2>
              <p>Productos: {cartItems.length}</p>
              <p>Total: S/ {total.toFixed(2)}</p>
              <Link to="/checkout"> <button className="checkout-btn">
                Continuar con el pago →
              </button>
              </Link>


            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};
