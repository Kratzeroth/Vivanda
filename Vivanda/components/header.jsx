import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../src/assets/logo-Vivanda.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../src/assets/CSS/header.css";

export const Header = () => {
    // Usuario simulado: null = no logueado
    const [user, setUser] = useState({ name: "Ecko" });
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="header-Container">
            <nav className="header-Nav">

                {/* Logo */}
                <div className="header-Logo">
                    <Link to="/home">
                        <img src={logo} alt="Logo" />
                    </Link>
                </div>

                {/* Buscador + menú */}
                <div className="header-Center">
                    <input
                        className="header-SearchInput"
                        type="text"
                        placeholder="Buscar productos, categorías..."
                    />
                    <ul className="header-Menu">
                        <li><Link to="/home">Inicio</Link></li>
                        <li><Link to="/products">Productos</Link></li>
                        <li><Link to="/offers">Ofertas</Link></li>
                        <li><Link to="/nosotros">Nosotros</Link></li>
                    </ul>
                </div>

                {/* Iconos + Login/Usuario */}
                <div className="header-Right">

                    {user ? (
                        <div
                            className="user-Dropdown"
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <i className="bi bi-person-fill Icon"></i>
                            <span className="user-Name">{user.name}</span>

                            {dropdownOpen && (
                                <div className="dropdown-Menu">
                                    <Link to="/user"><i className="bi bi-person-circle"></i> Mi Cuenta</Link>
                                    <Link to="/OrdersHistory"><i className="bi bi-box-seam"></i> Mis Pedidos</Link>
                                    <Link to="/help"><i className="bi bi-chat-dots"></i> Centro de Mensajes</Link>
                                    <Link to="/deseos"><i className="bi bi-heart"></i> Lista de Deseos</Link>
                                    <Link to="/devoluciones"><i className="bi bi-arrow-return-left"></i> Devoluciones</Link>
                                    <Link to="/ayuda"><i className="bi bi-question-circle"></i> Centro de Ayuda</Link>
                                    <button onClick={() => setUser(null)}>
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

                    {/* Carrito siempre visible */}
                    <Link to="/carrito"><i className="bi bi-cart Icon"></i></Link>
                </div>
            </nav>
        </header>
    );
};
