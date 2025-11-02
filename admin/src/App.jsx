import { Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./admin/login.jsx";
import Dashboard from "./admin/dashboard.jsx";
import Promotions from "./admin/promotions.jsx";
import Orders from "./admin/orders.jsx";
import Users from "./admin/users.jsx";
import Categories from "./admin/categories.jsx";
import Customers from "./admin/customers.jsx";
import Inventory from "./admin/inventory.jsx";
import Reports from "./admin/reports.jsx";
import Settings from "./admin/settings.jsx";
import Finance from "./admin/finance.jsx";
import Banners from "./admin/banners.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/promotions" element={<Promotions />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/users" element={<Users />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/finance" element={<Finance />} />
      <Route path="/banners" element={<Banners />} />
    </Routes>
  );
}
