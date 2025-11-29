import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../components/login.jsx";
import { Register } from "../components/register.jsx";
import { ProductsPage } from "../components/products.jsx";
import { Home } from "../components/home.jsx";
import PanelAdmin from "../components/PanelAdmin.jsx";
import { OffersPage } from "../components/OffersPage.jsx";
import { UserProfile } from "../components/user.jsx";
import { Cart } from "../components/carrito.jsx";
import { Checkout } from "../components/checkout.jsx";
import { OrdersHistory } from "../components/OrdersHistory.jsx";
import { HelpCenter } from "../components/HelpCenter.jsx";
import { ProductDetail } from "../components/ProductDetail.jsx";
<<<<<<< HEAD
import {Devoluciones} from "../components/devoluciones.jsx";
=======
>>>>>>> origin/main
import { AboutUs } from "../components/AboutUs.jsx"; // <-- nueva página

import "animate.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
<<<<<<< HEAD
        <Route path="/returns" element={<Devoluciones />} />
=======

>>>>>>> origin/main
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/OrdersHistory" element={<OrdersHistory />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/admin" element={<PanelAdmin />} />

        {/* Nueva ruta: Nosotros */}
        <Route path="/about" element={<AboutUs />} />

        {/* Redirección por si se escribe mal una ruta */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
