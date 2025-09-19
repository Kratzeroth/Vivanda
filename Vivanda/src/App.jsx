import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../components/login.jsx";
import { Register } from "../components/register.jsx";
import { ProductsPage } from "../components/products.jsx";
import { Home } from "../components/home.jsx";
import PanelAdmin from "../components/PanelAdmin.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/admin" element={<PanelAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
