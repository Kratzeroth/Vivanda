import { useState, useEffect } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/banners.css";

const API_URL = "http://localhost/Vivanda/admin/backend/banners.php";
const CRUD_URL = "http://localhost/Vivanda/admin/backend/banners_crud.php";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch {
      setError("Error al cargar banners");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editBanner) return;
    try {
      const formData = new FormData();
      if (editBanner.id_banner) {
        formData.append("action", "edit");
        formData.append("id", editBanner.id_banner);
      } else {
        formData.append("action", "create");
      }
      formData.append("title", editBanner.titulo);
      // El backend espera el archivo como 'imagen'
      if (editBanner.imagen instanceof File) {
        formData.append("imagen", editBanner.imagen);
      } else if (typeof editBanner.imagen === "string" && editBanner.imagen) {
        formData.append("imagen", editBanner.imagen);
      }
      const res = await fetch(CRUD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        await fetchBanners();
        setModalOpen(false);
        setEditBanner(null);
        setPreviewImg(null);
        setError(null);
      } else {
        setError(data.error || "Error al guardar banner");
      }
    } catch {
      setError("Error de red al guardar");
    }
  };

  const handleDelete = async (id_banner) => {
    if (!window.confirm("¿Seguro que deseas eliminar este banner?")) return;
    try {
      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("id", id_banner);
      const res = await fetch(CRUD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setBanners(banners.filter((b) => b.id_banner !== id_banner));
        setError(null);
      } else {
        setError(data.error || "Error al borrar");
      }
    } catch {
      setError("Error de red al borrar");
    }
  };

  const handleEdit = (banner) => {
    setEditBanner({ ...banner, imagen: null });
    setPreviewImg(banner.imagen_url ? `/${banner.imagen_url}` : null);
    setModalOpen(true);
  };

  const handleToggleActivo = async (banner) => {
    setEditBanner({ ...banner, activo: banner.activo ? 0 : 1 });
    // Guardar cambio de estado
    try {
      const formData = new FormData();
      formData.append("titulo", banner.titulo);
      formData.append("activo", banner.activo ? 0 : 1);
      formData.append("_method", "PUT");
      formData.append("id_banner", banner.id_banner);
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        await fetchBanners();
      } else {
        setError(data.error || "Error al actualizar estado");
      }
    } catch {
      setError("Error de red al actualizar estado");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <h1>Banners</h1>
        <button className="btn-add" onClick={() => {
          setEditBanner({ titulo: "", imagen: null, activo: 1 });
          setPreviewImg(null);
          setModalOpen(true);
        }}>Crear Banner</button>
        {error && <div className="error-msg">{error}</div>}
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <div className="banners-table-wrapper">
            <table className="banners-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id_banner}>
                    <td>
                      {banner.imagen_url ? (
                        <img
                          src={`http://localhost/Vivanda/cliente/public/images/banners/${banner.imagen_url.split('/').pop()}`}
                          alt={banner.titulo}
                          style={{ width: 100, height: 50, objectFit: "cover" }}
                        />
                      ) : (
                        "Sin imagen"
                      )}
                    </td>
                    <td>{banner.titulo}</td>
                    <td>
                      <button className={banner.activo ? "btn-activo" : "btn-inactivo"} onClick={() => handleToggleActivo(banner)}>
                        {banner.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(banner)}>Editar</button>
                      <button className="btn-delete" onClick={() => handleDelete(banner.id_banner)}>Borrar</button>
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
              <h2>{editBanner?.id_banner ? "Editar Banner" : "Nuevo Banner"}</h2>
              <input
                type="text"
                placeholder="Título"
                value={editBanner?.titulo || ""}
                onChange={e => setEditBanner({ ...editBanner, titulo: e.target.value })}
              />
              <div>
                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    setEditBanner({ ...editBanner, imagen: e.target.files[0] });
                    setPreviewImg(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                {previewImg && (
                  <img
                    src={previewImg}
                    alt="Preview"
                    style={{ width: 120, height: 60, objectFit: "cover", marginTop: 8 }}
                  />
                )}
              </div>
              <div className="modal-actions">
                <button className="btn-save" onClick={handleSave}>Guardar</button>
                <button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
