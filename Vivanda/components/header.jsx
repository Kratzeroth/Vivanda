import { Link } from "react-router-dom";
import logo from "../src/assets/logo-Vivanda.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../src/assets/CSS/header.css";

export const Header = () => {
  
    return (
        <header className="header-Container">
            <nav className="header-Nav">
                
                {/* Logo */}
                <div className="header-Logo">
                    <img src={logo} alt="Logo" />
                </div>

                {/* Buscador + menú */}
                <div className="header-Center">
                    <input className="header-SearchInput" type="text" placeholder="Buscar..." />
                    <ul className="header-Menu">
                        <li><Link to="/home">Inicio</Link></li>
                        <li><Link to="/productos">Productos</Link></li>
                        <li><Link to="/ofertas">Ofertas</Link></li>
                        <li><Link to="/nosotros">Nosotros</Link></li>
                    </ul>
                </div>

                {/* Iconos + botón */}
                <div className="header-Right">
                    <i className="bi bi-person-fill Icon"></i>
                    <i className="bi bi-cart Icon"></i>
                    <button className="header-Button"><Link to="/login">Iniciar Sesión</Link></button>
                </div>
            </nav>
        </header>
    );
};
