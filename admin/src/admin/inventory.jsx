import { useState, useEffect } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/inventory.css";

const API_URL = "http://localhost/Vivanda/admin/backend/inventory.php";

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product || {
      nombre_producto: "",
      precio: "",
      descripcion: "",
      imagen: null,
      id_categoria: ""
    }
  );

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Solo cargar categorías si es agregar (no editar)
    if (!product) {
      fetch("http://localhost/Vivanda/admin/backend/inventory.php?categorias=1")
        .then((res) => res.json())
        .then((data) => setCategorias(data))
        .catch(() => setCategorias([]));
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, imagen: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (product?.id_producto) formData.append("id_producto", product.id_producto);

    // enviar todos los campos
    for (const key in form) {
      formData.append(key, form[key]);
    }

    onSave(formData);
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <h2>{product ? "Editar Producto" : "Nuevo Producto"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Solo mostrar select de categoría si es agregar */}
          {!product && (
            <div>
              <label>Categoría</label>
              <select
                name="id_categoria"
                value={form.id_categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label>Nombre del Producto</label>
            <input
              type="text"
              name="nombre_producto"
              value={form.nombre_producto}
              onChange={handleChange}
              placeholder="Ej. Manzana Fuji"
              required
            />
          </div>

          <div>
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ej. Manzana dulce y jugosa"
              required
            />
          </div>

          <div>
            <label>Precio (S/)</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="Ej. 2.50"
              required
            />
          </div>

          <div>
            <label>Imagen</label>
            <input
              type="file"
              name="imagen"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-save">
              Guardar
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setLoading(true);
    try {
      if (editProduct) formData.append("_method", "PUT");

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.status === "success") {
        await fetchProducts();
        setModalOpen(false);
        setEditProduct(null);
      } else {
        setError(data.message || "Error al guardar");
      }
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_producto) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?id_producto=${id_producto}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.status === "success") {
        setProducts(products.filter((p) => p.id_producto !== id_producto));
      } else {
        setError(data.message || "Error al eliminar");
      }
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="inventory-content">
        <h1>Inventario de Productos</h1>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="btn-add" onClick={() => setModalOpen(true)}>
          Agregar Producto
        </button>

        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Precio (S/)</th>
                <th>Categoría</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id_producto}>
                    <td>{product.nombre_producto}</td>
                    <td>{product.descripcion}</td>
                    <td>{product.precio}</td>
                    <td>{product.nombre_categoria || "—"}</td>
                    <td>
                      {product.imagen_url ? (
                        <img
                          src={`http://localhost/Vivanda/cliente/public/${product.imagen_url}`}
                          alt={product.nombre_producto}
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditProduct(product);
                          setModalOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product.id_producto)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No hay productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <ProductModal
            product={editProduct}
            onClose={() => {
              setModalOpen(false);
              setEditProduct(null);
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
