import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/users.css";

const initialUsers = [
  { id: 1, name: "Juan Pérez", email: "juan@mail.com", status: "activo", role: "Admin" },
  { id: 2, name: "Ana Torres", email: "ana@mail.com", status: "inactivo", role: "Usuario" },
  { id: 3, name: "Carlos Díaz", email: "carlos@mail.com", status: "activo", role: "Usuario" },
 { id: 1, name: "Juan Pérez", email: "juan@mail.com", status: "activo", role: "Admin" },
  { id: 2, name: "Ana Torres", email: "ana@mail.com", status: "inactivo", role: "Usuario" },
  { id: 3, name: "Carlos Díaz", email: "carlos@mail.com", status: "activo", role: "Usuario" },
 { id: 1, name: "Juan Pérez", email: "juan@mail.com", status: "activo", role: "Admin" },
  { id: 2, name: "Ana Torres", email: "ana@mail.com", status: "inactivo", role: "Usuario" },
  { id: 3, name: "Carlos Díaz", email: "carlos@mail.com", status: "activo", role: "Usuario" },
 { id: 1, name: "Juan Pérez", email: "juan@mail.com", status: "activo", role: "Admin" },
  { id: 2, name: "Ana Torres", email: "ana@mail.com", status: "inactivo", role: "Usuario" },
  { id: 3, name: "Carlos Díaz", email: "carlos@mail.com", status: "activo", role: "Usuario" },
 { id: 1, name: "Juan Pérez", email: "juan@mail.com", status: "activo", role: "Admin" },
  { id: 2, name: "Ana Torres", email: "ana@mail.com", status: "inactivo", role: "Usuario" },
  { id: 3, name: "Carlos Díaz", email: "carlos@mail.com", status: "activo", role: "Usuario" },
 { id: 1, name: "Juan Pérez", email: "juan@mail.com", status: "activo", role: "Admin" },
  { id: 2, name: "Ana Torres", email: "ana@mail.com", status: "inactivo", role: "Usuario" },
  { id: 3, name: "Carlos Díaz", email: "carlos@mail.com", status: "activo", role: "Usuario" },
 { id: 1, name: "Juan Pérez", email: "juan@mail.com", status: "activo", role: "Admin" },
  { id: 2, name: "Ana Torres", email: "ana@mail.com", status: "inactivo", role: "Usuario" },
  { id: 3, name: "Carlos Díaz", email: "carlos@mail.com", status: "activo", role: "Usuario" },
 { id: 1, name: "Juan Pérez", email: "juan@mail.com", status: "activo", role: "Admin" },
  { id: 2, name: "Ana Torres", email: "ana@mail.com", status: "inactivo", role: "Usuario" },
  { id: 3, name: "Carlos Díaz", email: "carlos@mail.com", status: "activo", role: "Usuario" },

  { id: 1, name: "Juan Pérez", email: "juan@mail.com", status: "activo", role: "Admin" },
  { id: 2, name: "Ana Torres", email: "ana@mail.com", status: "inactivo", role: "Usuario" },
  { id: 3, name: "Carlos Díaz", email: "carlos@mail.com", status: "activo", role: "Usuario" },
];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (user) => {
    if (user.id) {
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      setUsers([...users, { ...user, id: Date.now() }]);
    }
    setModalOpen(false);
    setEditUser(null);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
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
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn-add" onClick={() => setModalOpen(true)}>Crear Usuario</button>
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className={`status ${user.status}`}>{user.status}</span></td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(user)}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="modal-bg" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{editUser ? "Editar Usuario" : "Nuevo Usuario"}</h2>

              <input
                type="text"
                placeholder="Nombre"
                value={editUser?.name || ""}
                onChange={e => setEditUser({ ...editUser, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={editUser?.email || ""}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
              />
              <select
                value={editUser?.status || "activo"}
                onChange={e => setEditUser({ ...editUser, status: e.target.value })}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <select
                value={editUser?.role || "Usuario"}
                onChange={e => setEditUser({ ...editUser, role: e.target.value })}
              >
                <option value="Admin">Admin</option>
                <option value="Usuario">Usuario</option>
              </select>

              <div className="modal-actions">
                <button className="btn-save" onClick={() => handleSave(editUser)}>Guardar</button>
                <button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
