import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/promotions.css";

// ----------------------- DATOS INICIALES -----------------------
const initialProducts = [
  "Laptop Gamer",
  "Monitor 144Hz",
  "Mouse Logitech",
  "Teclado Mecánico",
  "Auriculares Bluetooth",
  "Webcam 1080p",
  "Parlante Bluetooth",
  "Mousepad",
  "Auriculares Gamer",
  "Teclado RGB",
];

const initialPromotions = [
  { id: 1, name: "Black Friday", type: "Porcentaje", value: 20, active: true, products: ["Laptop Gamer", "Monitor 144Hz"] },
  { id: 2, name: "Envío Gratis", type: "Envío", value: 0, active: true, products: [] },
];

const initialSpecials = [
  { id: 1, name: "10% en Electrónica", description: "Aplicable a laptops, monitores y accesorios.", active: true },
  { id: 2, name: "Envío Gratis", description: "Pedidos superiores a S/150.", active: true },
];

// ----------------------- COMPONENTE PRINCIPAL -----------------------
export default function Promotions() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [specials, setSpecials] = useState(initialSpecials);

  const [modalPromoOpen, setModalPromoOpen] = useState(false);
  const [modalSpecialOpen, setModalSpecialOpen] = useState(false);

  const [editPromo, setEditPromo] = useState(null);
  const [editSpecial, setEditSpecial] = useState(null);

  // ----------------------- LÓGICA PROMOCIONES -----------------------
  const handleSavePromo = (promo) => {
    if (promo.id) {
      setPromotions(promotions.map(p => p.id === promo.id ? promo : p));
    } else {
      setPromotions([...promotions, { ...promo, id: Date.now(), products: promo.products || [] }]);
    }
    setModalPromoOpen(false);
    setEditPromo(null);
  };

  const handleEditPromo = (promo) => {
    setEditPromo(promo);
    setModalPromoOpen(true);
  };

  const handleDeletePromo = (id) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  // ----------------------- LÓGICA ESPECIALES -----------------------
  const handleSaveSpecial = (special) => {
    if (special.id) {
      setSpecials(specials.map(s => s.id === special.id ? special : s));
    } else {
      setSpecials([...specials, { ...special, id: Date.now() }]);
    }
    setModalSpecialOpen(false);
    setEditSpecial(null);
  };

  const handleEditSpecial = (special) => {
    setEditSpecial(special);
    setModalSpecialOpen(true);
  };

  const handleDeleteSpecial = (id) => {
    setSpecials(specials.filter(s => s.id !== id));
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="promotions-content">
        <h1>Gestión de Promociones y Descuentos</h1>

        {/* --- SECCIÓN PROMOCIONES --- */}
        <button className="btn-add-promo" onClick={() => { setEditPromo(null); setModalPromoOpen(true); }}>
          Agregar Promoción
        </button>

        <div className="promotions-table-wrapper">
          <table className="promotions-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Productos Aplicables</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.type}</td>
                  <td>{p.type === "Porcentaje" ? `${p.value}%` : p.value}</td>
                  <td>{p.products.length > 0 ? p.products.join(", ") : "Todos"}</td>
                  <td>{p.active ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button className="btn-edit-promo" onClick={() => handleEditPromo(p)}>Editar</button>
                    <button className="btn-delete-promo" onClick={() => handleDeletePromo(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- SECCIÓN DESCUENTOS ESPECIALES --- */}
        <div className="discounts-section">
          <h2>Descuentos Especiales</h2>
          <button className="btn-add-promo" onClick={() => { setEditSpecial(null); setModalSpecialOpen(true); }}>
            Agregar Descuento Especial
          </button>
          <div className="discount-cards">
            {specials.map(s => (
              <div key={s.id} className="discount-card">
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <p>Estado: **{s.active ? "Activo" : "Inactivo"}**</p>
                <div>
                  <button className="btn-edit-promo" onClick={() => handleEditSpecial(s)}>Editar</button>
                  <button className="btn-delete-promo" onClick={() => handleDeleteSpecial(s.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- MODALES --- */}
        {modalPromoOpen && (
          <PromotionModal
            promo={editPromo}
            productsList={initialProducts}
            onClose={() => { setModalPromoOpen(false); setEditPromo(null); }}
            onSavePromo={handleSavePromo}
          />
        )}

        {modalSpecialOpen && (
          <SpecialDiscountModal
            special={editSpecial}
            onClose={() => { setModalSpecialOpen(false); setEditSpecial(null); }}
            onSaveSpecial={handleSaveSpecial}
          />
        )}
      </div>
    </div>
  );
}

// ----------------------- MODAL PROMOCIÓN (Tipo, Valor, Productos) -----------------------
function PromotionModal({ promo, productsList, onClose, onSavePromo }) {
  const isEditing = !!promo;
  const [form, setForm] = useState(
    isEditing
      ? promo
      : { name: "", type: "Porcentaje", value: 0, active: true, products: [] }
  );

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      setSuggestions(productsList.filter(p => p.toLowerCase().includes(value.toLowerCase()) && !form.products.includes(p)));
    } else {
      setSuggestions([]);
    }
  };

  const addProduct = (product) => {
    setForm({ ...form, products: [...form.products, product] });
    setInputValue("");
    setSuggestions([]);
  };

  const removeProduct = (product) => {
    setForm({ ...form, products: form.products.filter(p => p !== product) });
  };
  
  const handleSave = () => {
    // Validación simple
    if (!form.name || form.value === undefined || form.value < 0) {
      alert("Por favor, completa el nombre y el valor de la promoción.");
      return;
    }
    onSavePromo(form);
  }

  return (
    <div className="modal-bg-promo">
      <div className="modal-promo">
        <h2>{isEditing ? "Editar Promoción" : "Nueva Promoción"}</h2>

        <input
          type="text"
          placeholder="Nombre de la Promoción"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="Porcentaje">Porcentaje (%)</option>
          <option value="Envío">Envío (Monto Fijo)</option>
        </select>

        <input
          type="number"
          placeholder={form.type === "Porcentaje" ? "Valor (0-100)" : "Valor (Monto Fijo)"}
          value={form.value}
          onChange={e => setForm({ ...form, value: Number(e.target.value) })}
        />

        <div className="product-list">
          <h4>Productos Aplicables</h4>
          {/* Contenedor clave para el despliegue de sugerencias */}
          <div className="search-container"> 
            <input
              type="text"
              placeholder="Buscar producto para agregar..."
              value={inputValue}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((p, i) => (
                  <li key={i} onClick={() => addProduct(p)}>{p}</li>
                ))}
              </ul>
            )}
          </div>
          <ul className="selected-products">
            {form.products.map((p, i) => (
              <li key={i}>
                {p} <button type="button" onClick={() => removeProduct(p)}>X</button>
              </li>
            ))}
          </ul>
        </div>

        <label className="label-active">
          <input
            type="checkbox"
            checked={form.active}
            onChange={e => setForm({ ...form, active: e.target.checked })}
          />
          Activo
        </label>

        <div className="modal-actions-promo">
          <button className="btn-save-promo" onClick={handleSave}>Guardar</button>
          <button className="btn-cancel-promo" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// ----------------------- MODAL DESCUENTO ESPECIAL (Nombre, Descripción) -----------------------
function SpecialDiscountModal({ special, onClose, onSaveSpecial }) {
  const isEditing = !!special;
  const [form, setForm] = useState(
    isEditing
      ? special
      : { name: "", description: "", active: true }
  );

  const handleSave = () => {
    // Validación simple
    if (!form.name || !form.description) {
      alert("Por favor, completa el nombre y la descripción del descuento.");
      return;
    }
    onSaveSpecial(form);
  }

  return (
    <div className="modal-bg-promo">
      <div className="modal-promo">
        <h2>{isEditing ? "Editar Descuento Especial" : "Nuevo Descuento Especial"}</h2>

        <input
          type="text"
          placeholder="Nombre del Descuento"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Descripción del Descuento (e.g., Pedidos superiores a S/150)"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <label className="label-active">
          <input
            type="checkbox"
            checked={form.active}
            onChange={e => setForm({ ...form, active: e.target.checked })}
          />
          Activo
        </label>

        <div className="modal-actions-promo">
          <button className="btn-save-promo" onClick={handleSave}>Guardar</button>
          <button className="btn-cancel-promo" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}