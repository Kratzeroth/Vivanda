import { useState, useEffect } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/promotions.css";



// ----------------------- COMPONENTE PRINCIPAL -----------------------
export default function Promotions() {
  const [products, setProducts] = useState([]);

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalPromoOpen, setModalPromoOpen] = useState(false);
  const [editPromo, setEditPromo] = useState(null);
  // Estado persistente del formulario del modal
  const [promoFormData, setPromoFormData] = useState(null);

  // Cargar promociones y productos desde el backend
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost/Vivanda/admin/backend/promotions.php").then(res => res.json()),
      fetch("http://localhost/Vivanda/admin/backend/productos.php").then(res => res.json())
    ])
      .then(([promos, prods]) => {
        setPromotions(promos);
        setProducts(prods);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // Guardar promoción (crear o editar)
  const handleSavePromo = async (promo) => {
    setLoading(true);
    setError(null);
    try {
      const method = promo.id_promocion ? "PUT" : "POST";
      const res = await fetch("http://localhost/Vivanda/admin/backend/promotions.php", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promo)
      });
      const data = await res.json();
      if (data.status === "success") {
        // Recargar promociones
        const promos = await fetch("http://localhost/Vivanda/admin/backend/promotions.php").then(r => r.json());
        setPromotions(promos);
        setModalPromoOpen(false);
        setEditPromo(null);
      } else {
        setError(data.message || "Error al guardar");
      }
    } catch (e) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  // Editar promoción
  const handleEditPromo = (promo) => {
    setEditPromo(promo);
    setPromoFormData({
      ...promo,
      productos: promo.productos || []
    });
    setModalPromoOpen(true);
  };

  // Eliminar promoción
  const handleDeletePromo = async (id_promocion) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost/Vivanda/admin/backend/promotions.php?id_promocion=${id_promocion}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        setPromotions(promotions.filter(p => p.id_promocion !== id_promocion));
      } else {
        setError(data.message || "Error al eliminar");
      }
    } catch (e) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
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
        <button className="btn-add-promo" onClick={() => {
          setEditPromo(null);
          if (!promoFormData) {
            setPromoFormData(null);
          }
          setModalPromoOpen(true);
        }}>
          Agregar Promoción
        </button>
        {loading && <p>Cargando...</p>}
        {error && <p style={{color:'red'}}>{error}</p>}
        <div className="promotions-table-wrapper">
          <table className="promotions-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Descuento (%)</th>
                <th>Productos</th>
                <th>Vigencia</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map(p => (
                <tr key={p.id_promocion}>
                  <td>{p.titulo}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.descuento_porcentaje}</td>
                  <td>{p.productos && p.productos.length > 0 ? p.productos.join(", ") : "Todos"}</td>
                  <td>{p.fecha_inicio} a {p.fecha_fin}</td>
                  <td>{Number(p.activo) === 1 ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button className="btn-edit-promo" onClick={() => handleEditPromo(p)}>Editar</button>
                    <button className="btn-delete-promo" onClick={() => handleDeletePromo(p.id_promocion)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalPromoOpen && (
          <PromotionModal
            promo={editPromo}
            onClose={() => setModalPromoOpen(false)}
            onSavePromo={handleSavePromo}
            productsList={products}
            formData={promoFormData}
            setFormData={setPromoFormData}
          />
        )}
      </div>
    </div>
  );
}

function PromotionModal({ promo, onClose, onSavePromo, productsList, formData, setFormData }) {
  const isEditing = !!promo;
  // ...eliminar lógica de categorías y productos filtrados...

  // Estado del formulario: persistente
  const [form, setForm] = useState(() =>
    formData || { titulo: "", descripcion: "", descuento_porcentaje: 0, fecha_inicio: "", fecha_fin: "", activo: 1, productos: [] }
  );

  // Sincronizar cambios locales con el estado externo
  useEffect(() => {
    setFormData && setFormData(form);
    // eslint-disable-next-line
  }, [form]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? (checked ? 1 : 0) : value }));
  };

  // ...eliminar handlers de categoría y producto...

  const handleSave = () => {
    if (!form.titulo || !form.descuento_porcentaje) {
      alert("Completa los campos obligatorios");
      return;
    }
    onSavePromo(form);
    // Limpiar el estado persistente solo al guardar
    setFormData && setFormData(null);
  };

  return (
    <div className="modal-bg-promo">
      <div className="modal-promo">
        <h2>{isEditing ? "Editar Promoción" : "Nueva Promoción"}</h2>
        <div style={{marginBottom: 12}}>
          <label style={{fontWeight:'bold'}}>Título de la promoción</label>
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            style={{width:'100%'}}
          />
        </div>
        <div style={{marginBottom: 12}}>
          <label style={{fontWeight:'bold'}}>Descripción de la promoción</label>
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            style={{width:'100%'}}
          />
        </div>
        {/* Campos de categoría y producto eliminados */}
        <div style={{marginBottom: 12}}>
          <label style={{fontWeight:'bold'}}>Descuento (%)</label>
          <input
            type="number"
            name="descuento_porcentaje"
            placeholder="Descuento (%)"
            value={form.descuento_porcentaje}
            onChange={handleChange}
            style={{width:'100%'}}
          />
        </div>
        <div style={{marginBottom: 12, display:'flex', gap:8}}>
          <div style={{flex:1}}>
            <label style={{fontWeight:'bold'}}>Fecha de inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              value={form.fecha_inicio || ""}
              onChange={handleChange}
              style={{width:'100%'}}
            />
          </div>
          <div style={{flex:1}}>
            <label style={{fontWeight:'bold'}}>Fecha de expiración</label>
            <input
              type="date"
              name="fecha_fin"
              value={form.fecha_fin || ""}
              onChange={handleChange}
              style={{width:'100%'}}
            />
          </div>
        </div>
        <div style={{marginBottom: 12}}>
          <label style={{fontWeight:'bold'}}>¿Activo?</label>
          <input
            type="checkbox"
            name="activo"
            checked={!!form.activo}
            onChange={handleChange}
            style={{marginLeft:8}}
          />
        </div>
        <div className="modal-actions-promo">
          <button className="btn-save-promo" onClick={handleSave}>Guardar</button>
          <button className="btn-cancel-promo" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}