import { useState, useEffect } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/users.css";

const API_URL = "http://localhost/Vivanda/admin/backend/users.php";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Error al cargar usuarios");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtrar usuarios
  const filteredUsers = users.filter(
    (u) =>
      (u.nombres + " " + u.apellidos).toLowerCase().includes(search.toLowerCase()) ||
      (u.correo || "").toLowerCase().includes(search.toLowerCase())
  );

  // Guardar cambios (crear/editar)
  const handleSave = async () => {
    if (!editUser) return;
    try {
      const formData = new FormData();
      if (editUser.id_usuario) formData.append("id_usuario", editUser.id_usuario);
      formData.append("nombres", editUser.nombres);
      formData.append("apellidos", editUser.apellidos);
      formData.append("telefono", editUser.telefono || "");
      formData.append("correo", editUser.correo);
      formData.append("rol", editUser.rol || "Usuario");
      if (editUser.foto_perfil instanceof File) {
        formData.append("foto_perfil", editUser.foto_perfil);
      }
      if (editUser.id_usuario) formData.append("_method", "PUT");

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const res = await fetch(API_URL);
        const updated = await res.json();
        setUsers(updated);
        setModalOpen(false);
        setEditUser(null);
        setPreviewImg(null);
        setError(null);
      } else {
        setError(data.error || "Error al guardar cambios");
        if (data.error) alert(data.error);
      }
    } catch {
      setError("Error de red al guardar");
    }
  };

  // Editar usuario
  const handleEdit = (user) => {
    setEditUser({ ...user, foto_perfil: null });
    setPreviewImg(
      user.foto_perfil
        ? `http://localhost/Vivanda/cliente/backend/${user.foto_perfil}`
        : null
    );
    setModalOpen(true);
  };

  // Borrar usuario
  const handleDelete = async (id_usuario) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`${API_URL}?id_usuario=${id_usuario}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter((u) => u.id_usuario !== id_usuario));
        setError(null);
      } else {
        setError(data.error || "Error al borrar");
      }
    } catch {
      setError("Error de red al borrar");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="users-content">
        <h1>Usuarios</h1>

        <div className="users-top">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn-add"
            onClick={() => {
              setEditUser({ nombres: "", apellidos: "", telefono: "", correo: "", foto_perfil: null });
              setPreviewImg(null);
              setModalOpen(true);
            }}
          >
            Crear Usuario
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id_usuario}>
                    <td>
                      {user.foto_perfil ? (
                        <img
                          src={`http://localhost/Vivanda/cliente/backend/${user.foto_perfil}`}
                          alt={user.nombres}
                          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "50%" }}
                        />
                      ) : (
                        "Sin foto"
                      )}
                    </td>
                    <td>{user.nombres}</td>
                    <td>{user.apellidos}</td>
                    <td>{user.telefono}</td>
                    <td>{user.correo}</td>
                    <td>{user.rol || "Usuario"}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(user)}>
                        Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user.id_usuario)}
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
              <h2>{editUser?.id_usuario ? "Editar Usuario" : "Nuevo Usuario"}</h2>

              <input
                type="text"
                placeholder="Nombres"
                value={editUser?.nombres || ""}
                onChange={(e) => setEditUser({ ...editUser, nombres: e.target.value })}
              />
              <input
                type="text"
                placeholder="Apellidos"
                value={editUser?.apellidos || ""}
                onChange={(e) => setEditUser({ ...editUser, apellidos: e.target.value })}
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={editUser?.telefono || ""}
                onChange={(e) => setEditUser({ ...editUser, telefono: e.target.value })}
              />
              <input
                type="email"
                placeholder="Correo"
                value={editUser?.correo || ""}
                onChange={(e) => setEditUser({ ...editUser, correo: e.target.value })}
              />
              <div>
                <label>Foto de perfil</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setEditUser({ ...editUser, foto_perfil: e.target.files[0] });
                    setPreviewImg(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                {previewImg && (
                  <img
                    src={previewImg}
                    alt="Preview"
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: "50%", marginTop: 8 }}
                  />
                )}
              </div>
              <div>
                <label>Rol:</label>
                <select
                  value={editUser?.rol || "Usuario"}
                  onChange={e => setEditUser({ ...editUser, rol: e.target.value })}
                  disabled={!!editUser?.id_usuario && editUser?.rol === 'Administrador' && userIsSelf(editUser)}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Usuario">Usuario</option>
                </select>
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

// Helper para evitar que un admin se baje su propio rol (opcional, puedes quitar la lógica si no la quieres):
function userIsSelf(user) {
  // Aquí podrías comparar con el usuario logueado si tienes esa info
  return false;
}
