import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/coupons.css";

const initialCoupons = [
  { id: 1, code: "OFERTA10", description: "10% de descuento en toda la tienda", discount: "10%", status: "activo" },
  { id: 2, code: "ENVIOGRATIS", description: "Envío gratis para compras mayores a S/50", discount: "100%", status: "inactivo" },
];

export default function Coupons() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [search, setSearch] = useState("");
  const [editCoupon, setEditCoupon] = useState({ code: "", description: "", discount: "", status: "activo" });

  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!editCoupon.code) return;
    if (editCoupon.id) {
      setCoupons(coupons.map(c => c.id === editCoupon.id ? editCoupon : c));
    } else {
      setCoupons([...coupons, { ...editCoupon, id: Date.now() }]);
    }
    setEditCoupon({ code: "", description: "", discount: "", status: "activo" });
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
  };

  const handleDelete = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const toggleStatus = (coupon) => {
    setCoupons(coupons.map(c => c.id === coupon.id ? { ...c, status: c.status === "activo" ? "inactivo" : "activo" } : c));
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <h1>Cupones</h1>

        <div className="coupon-form">
          <input
            type="text"
            placeholder="Código del cupón"
            value={editCoupon.code}
            onChange={e => setEditCoupon({ ...editCoupon, code: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={editCoupon.description}
            onChange={e => setEditCoupon({ ...editCoupon, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descuento (10%, 50, S/20)"
            value={editCoupon.discount}
            onChange={e => setEditCoupon({ ...editCoupon, discount: e.target.value })}
          />
          <select
            value={editCoupon.status}
            onChange={e => setEditCoupon({ ...editCoupon, status: e.target.value })}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <button className="btn-save" onClick={handleSave}>Guardar Cupón</button>
        </div>

        <div className="coupons-top">
          <input
            type="text"
            placeholder="Buscar cupón..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="coupons-table-wrapper">
          {filteredCoupons.map(coupon => (
            <div key={coupon.id} className="coupon-section">
              <div className="coupon-top">
                <input type="text" value={coupon.code} readOnly />
                <input type="text" value={coupon.description} readOnly />
                <input type="text" value={coupon.discount} readOnly />
                <select value={coupon.status} onChange={() => toggleStatus(coupon)}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                <button className="btn-edit" onClick={() => handleEdit(coupon)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(coupon.id)}>Borrar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
