import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/inventory.css";

const initialProducts = [
  { id: 1, name: "Laptop Gamer", category: "Electrónica", stock: 12, price: 4500, provider: "Proveedor A" },
  { id: 2, name: "Mouse Logitech", category: "Accesorios", stock: 45, price: 120, provider: "Proveedor B" },
  { id: 3, name: "Monitor 144Hz", category: "Electrónica", stock: 8, price: 980, provider: "Proveedor C" },
  { id: 4, name: "Teclado Mecánico", category: "Accesorios", stock: 30, price: 250, provider: "Proveedor B" },
  { id: 5, name: "Auriculares Bluetooth", category: "Accesorios", stock: 25, price: 150, provider: "Proveedor D" },
  { id: 6, name: "Webcam 1080p", category: "Electrónica", stock: 15, price: 300, provider: "Proveedor C" }
];

export default function Inventory() {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState({ search: "", category: "all" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const filteredProducts = products.filter(p =>
    (filter.category === "all" || p.category === filter.category) &&
    p.name.toLowerCase().includes(filter.search.toLowerCase())
  );

  const handleSave = (product) => {
    const updatedProduct = { ...product, status: product.stock > 0 ? "Activo" : "Agotado" };
    if (product.id) {
      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
    } else {
      setProducts([...products, { ...updatedProduct, id: Date.now() }]);
    }
    setModalOpen(false);
    setEditProduct(null);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="inventory-content">
        <h1>Inventario de Productos</h1>

        {/* Filtros */}
        <div className="inventory-filters">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
          />
          <select
            value={filter.category}
            onChange={e => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="all">Todas las categorías</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Accesorios">Accesorios</option>
          </select>
        </div>

        {/* Botón agregar */}
        <button className="btn-add" onClick={() => setModalOpen(true)}>Agregar Producto</button>

        {/* Tabla de inventario */}
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Proveedor</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td>{p.price}</td>
                  <td>{p.provider}</td>
                  <td>{p.status}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(p)}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para agregar/editar */}
        {modalOpen && (
          <ProductModal
            product={editProduct}
            onClose={() => { setModalOpen(false); setEditProduct(null); }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || { name: "", category: "Electrónica", stock: 0, price: 0, provider: "" });

  return (
    <div className="modal-bg">
      <div className="modal">
        <h2>{product ? "Editar Producto" : "Nuevo Producto"}</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="Electrónica">Electrónica</option>
          <option value="Accesorios">Accesorios</option>
        </select>

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
        />

        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
        />

        <input
          type="text"
          placeholder="Proveedor"
          value={form.provider}
          onChange={(e) => setForm({ ...form, provider: e.target.value })}
        />

        <div className="modal-actions">
          <button className="btn-save" onClick={() => onSave(form)}>Guardar</button>
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
