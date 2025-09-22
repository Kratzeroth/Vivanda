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

import "animate.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/OrdersHistory" element={<OrdersHistory />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/admin" element={<PanelAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
