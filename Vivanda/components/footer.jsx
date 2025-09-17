import "../src/assets/CSS/footer.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="footer-section">

            <div className="footer-element">
                <img src="../src/assets/footer-vivanda.png" alt="Vivanda Logo" />
                <div className="f1-container">
                    <h3>Contáctenos</h3>
                    <div className="f1-element">
                        <i className="bi bi-envelope"></i>
                        <p>servicioalcliente.vivanda@spsa.pe</p>
                    </div>
                    <div className="f1-element">
                        <i className="bi bi-telephone"></i>
                        <p>(01) 610-6000</p>
                    </div>
                    <div className="f1-element">
                        <i className="bi bi-geo-alt"></i>
                        <p>Av. Benavides 4305, Santiago de Surco, Lima – Perú</p>
                    </div>
                    <div className="f1-element">
                        <i className="bi bi-clock"></i>
                        <p>Lun - Dom: 8:00 am - 10:00 pm</p>
                    </div>

                    <div className="f1-socials">
                        <i className="bi bi-facebook"></i>
                        <i className="bi bi-instagram"></i>
                        <i className="bi bi-youtube"></i>
                        <i className="bi bi-tiktok"></i>
                    </div>
                </div>
            </div>


            <div className="footer-element">
                <h3>Acerca de</h3>
                <Link to="/nosotros">Nosotros</Link>
                <Link to="/politica-privacidad">Política de Privacidad</Link>
                <Link to="/terminos-condiciones">Términos y Condiciones</Link>
                <Link to="/contacto">Contáctanos</Link>
                <Link to="/ofertas">Ofertas y Promociones</Link>
            </div>

            <div className="footer-element">
                <h3>Mi Cuenta</h3>
                <Link to="/login">Iniciar Sesión</Link>
                <Link to="/registro">Registrarse</Link>
                <Link to="/mis-pedidos">Mis Pedidos</Link>
                <Link to="/lista-compras">Lista de Compras</Link>
                <Link to="/ayuda">Ayuda</Link>
            </div>


            <div className="footer-element">
                <h4>Métodos de Pago</h4>
                <div className="f1-payments">
                    <img src="../src/assets/visa.png" alt="Visa" />
                    <img src="../src/assets/mastercard.png" alt="MasterCard" />
                    <img src="../src/assets/yape.png" alt="Yape" />
                    <img src="../src/assets/plin.png" alt="Plin" />
                </div>
            </div>
        </footer>
    );
};
