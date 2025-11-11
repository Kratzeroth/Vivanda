import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../src/assets/logo-Vivanda.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../src/assets/CSS/header.css";
import { Assistant } from "./Assistant"; 

export const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
 const [assistantOpen, setAssistantOpen] = useState(false);

  // Cargar usuario de localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Cargar carrito cuando se abre el sidebar
  useEffect(() => {
    if (cartOpen && user) {
      fetch(
        `http://localhost/Vivanda/cliente/backend/get_cart.php?id_usuario=${user.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setCartItems(data.productos);
            setTotal(data.total);
          }
        })
        .catch((err) => console.error("Error cargando carrito:", err));
    }
  }, [cartOpen, user]);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <header className="header-Container">
        <nav className="header-Nav">
          {/* Logo */}
          <div className="header-Logo">
            <Link to="/home">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Menú */}
          <ul className="header-Menu">
            <li>
              <Link to="/home">Inicio</Link>
            </li>
            <li>
              <Link to="/products">Productos</Link>
            </li>
            <li>
              <Link to="/offers">Ofertas</Link>
            </li>
            <li>
              <Link to="/about">Nosotros</Link>
            </li>
          </ul>

          {/* Buscador */}
          <div className="header-Center">
            <input
              className="header-SearchInput"
              type="text"
              placeholder="Buscar productos, categorías..."
            />
          </div>

          {/* Iconos derecha */}
          <div className="header-Right">
            {/* Carrito abre el drawer */}
            <div className="icon-Box" onClick={() => setCartOpen(true)}>
              <i className="bi bi-cart Icon"></i>
              <span className="icon-Label">Carrito</span>
            </div>

            {/* Usuario */}
            {user ? (
              <div
                className="user-Dropdown icon-Box"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <i className="bi bi-person-fill Icon"></i>
                <span className="icon-Label">{user.nombre}</span>

                {dropdownOpen && (
                  <div className="dropdown-Menu">
                    <Link to="/user">
                      <i className="bi bi-person-circle"></i> Mi Cuenta
                    </Link>
                    <Link to="/OrdersHistory">
                      <i className="bi bi-box-seam"></i> Mis Pedidos
                    </Link>
            
                  
                    <Link to="/devoluciones">
                      <i className="bi bi-arrow-return-left"></i> Devoluciones
                    </Link>
                    <Link to="/help">
                      <i className="bi bi-question-circle"></i> Centro de Ayuda
                    </Link>
                    <button onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="header-Button">
                <Link to="/login">Iniciar Sesión</Link>
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Overlay oscuro */}
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}></div>
      )}

      {/* Drawer lateral del carrito */}
      <div className={`cart-Sidebar ${cartOpen ? "open" : ""}`}>
        <div className="cart-Header">
          <h2>Carrito</h2>
          <button className="close-Btn" onClick={() => setCartOpen(false)}>
            ✕
          </button>
        </div>

        <div className="cart-Content">
          <h3 className="cart-subtitle">
            Tienes {cartItems.length}{" "}
            {cartItems.length === 1 ? "item" : "items"}
          </h3>

          {cartItems.length === 0 ? (
            <p className="empty-cart">Tu carrito está vacío</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id_producto} className="cart-item">
                    <img
                      src={item.imagen ? `/${item.imagen}` : "/images/productos/default.png"}
                      alt={item.nombre}
                    />

                    <div className="cart-info">
                      <h4>{item.nombre}</h4>
                      <p className="price">
                        S/ {parseFloat(item.precio).toFixed(2)}
                      </p>
                      <span className="qty">Cantidad: {item.cantidad}</span>
                    </div>
                    <button className="delete-item">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              {/* Resumen */}
              <div className="cart-summary">
                <div className="row">
                  <span className="label">Subtotal</span>
                  <span className="value">S/ {total.toFixed(2)}</span>
                </div>
                <div className="row">
                  <span className="label">Entrega</span>
                  <span className="value free">GRATIS</span>
                </div>
                <div className="row total">
                  <span className="label">Total</span>
                  <span className="value">S/ {total.toFixed(2)}</span>
                </div>
                <Link to="/carrito">
                  <button className="checkout-btn">VER CARRITO</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
        <Assistant 
                isOpen={assistantOpen} 
                setIsOpen={setAssistantOpen} 
            />
    </>
  );
};
