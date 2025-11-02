import { useState, useEffect } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/categories.css";

const API_URL = "http://localhost/Vivanda/admin/backend/categories.php";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Error al cargar categorías");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Filtrar categorías
  const filteredCategories = categories.filter(
    (c) =>
      (c.nombre_categoria || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (c.descripcion || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Guardar cambios (crear/editar)
  const handleSave = async () => {
    if (!editCategory) return;
    try {
      const formData = new FormData();
      if (editCategory.id_categoria)
        formData.append("id_categoria", editCategory.id_categoria);
      formData.append("nombre_categoria", editCategory.nombre_categoria);
      formData.append("descripcion", editCategory.descripcion || "");
      if (editCategory.imagen instanceof File) {
        formData.append("imagen", editCategory.imagen);
      }
      if (editCategory.id_categoria) formData.append("_method", "PUT");

      // Log para depuración: mostrar el contenido del FormData
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
      }

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        const res = await fetch(API_URL);
        const updated = await res.json();
        setCategories(updated);
        setModalOpen(false);
        setEditCategory(null);
        setPreviewImg(null);
        setError(null);
      } else {
        setError(data.message || "Error al guardar cambios");
        if (data.message) alert(data.message);
      }
    } catch {
      setError("Error de red al guardar");
    }
  };

  // Editar categoría
  const handleEdit = (cat) => {
    setEditCategory({ ...cat, imagen: null });
    setPreviewImg(
      cat.imagen_url
        ? `http://localhost/Vivanda/cliente/public/${cat.imagen_url}`
        : null
    );
    setModalOpen(true);
  };

  // Borrar categoría
  const handleDelete = async (id_categoria) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_categoria }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setCategories(categories.filter((c) => c.id_categoria !== id_categoria));
        setError(null);
      } else {
        setError(data.message || "Error al borrar");
      }
    } catch {
      setError("Error de red al borrar");
    }
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
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn-add"
            onClick={() => {
              setEditCategory({ nombre_categoria: "", descripcion: "", imagen: null });
              setPreviewImg(null);
              setModalOpen(true);
            }}
          >
            Crear Categoría
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <div className="categories-table-wrapper">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.id_categoria}>
                    <td>
                      {cat.imagen_url ? (
                        <img
                          src={`http://localhost/Vivanda/cliente/public/${cat.imagen_url}`}
                          alt={cat.nombre_categoria}
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                        />
                      ) : (
                        "Sin imagen"
                      )}
                    </td>
                    <td>{cat.nombre_categoria}</td>
                    <td>{cat.descripcion}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(cat)}>
                        Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(cat.id_categoria)}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modalOpen && (
          <div className="modal-bg" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editCategory?.id_categoria ? "Editar Categoría" : "Nueva Categoría"}</h2>

              <input
                type="text"
                placeholder="Nombre"
                value={editCategory?.nombre_categoria || ""}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, nombre_categoria: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Descripción"
                value={editCategory?.descripcion || ""}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, descripcion: e.target.value })
                }
              />
              <div>
                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setEditCategory({ ...editCategory, imagen: e.target.files[0] });
                    setPreviewImg(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                {previewImg && (
                  <img
                    src={previewImg}
                    alt="Preview"
                    style={{ width: 80, height: 80, objectFit: "cover", marginTop: 8 }}
                  />
                )}
              </div>

              <div className="modal-actions">
                <button className="btn-save" onClick={handleSave}>
                  Guardar
                </button>
                <button className="btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
