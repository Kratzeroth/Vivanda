import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/categories.css";

const initialCategories = [
  { id: 1, name: "Electrónica", description: "Productos electrónicos", status: "activo" },
  { id: 2, name: "Ropa", description: "Vestimenta y accesorios", status: "activo" },
  { id: 3, name: "Hogar", description: "Productos para el hogar", status: "inactivo" },
 { id: 1, name: "Electrónica", description: "Productos electrónicos", status: "activo" },
  { id: 2, name: "Ropa", description: "Vestimenta y accesorios", status: "activo" },
   { id: 1, name: "Electrónica", description: "Productos electrónicos", status: "activo" },
  { id: 2, name: "Ropa", description: "Vestimenta y accesorios", status: "activo" },
   { id: 1, name: "Electrónica", description: "Productos electrónicos", status: "activo" },
  { id: 2, name: "Ropa", description: "Vestimenta y accesorios", status: "activo" },
   { id: 1, name: "Electrónica", description: "Productos electrónicos", status: "activo" },
  { id: 2, name: "Ropa", description: "Vestimenta y accesorios", status: "activo" },
   { id: 1, name: "Electrónica", description: "Productos electrónicos", status: "activo" },
  { id: 2, name: "Ropa", description: "Vestimenta y accesorios", status: "activo" },
   { id: 1, name: "Electrónica", description: "Productos electrónicos", status: "activo" },
  { id: 2, name: "Ropa", description: "Vestimenta y accesorios", status: "activo" },
  
];

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (cat) => {
    if (!cat) return;
    if (cat.id) {
      setCategories(categories.map(c => c.id === cat.id ? cat : c));
    } else {
      setCategories([...categories, { ...cat, id: Date.now() }]);
    }
    setModalOpen(false);
    setEditCategory(null);
  };

  const handleEdit = (cat) => {
    setEditCategory(cat);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <h1>Categorías</h1>

        <div className="categories-top">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn-add" onClick={() => setModalOpen(true)}>Crear Categoría</button>
        </div>

        <div className="categories-table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td><span className={`status ${cat.status}`}>{cat.status}</span></td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(cat)}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(cat.id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="modal-bg" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{editCategory ? "Editar Categoría" : "Nueva Categoría"}</h2>

              <input
                type="text"
                placeholder="Nombre"
                value={editCategory?.name || ""}
                onChange={e => setEditCategory({ ...editCategory, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={editCategory?.description || ""}
                onChange={e => setEditCategory({ ...editCategory, description: e.target.value })}
              />
              <select
                value={editCategory?.status || "activo"}
                onChange={e => setEditCategory({ ...editCategory, status: e.target.value })}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>

              <div className="modal-actions">
                <button className="btn-save" onClick={() => handleSave(editCategory)}>Guardar</button>
                <button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
