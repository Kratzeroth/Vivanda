import { useState, useEffect } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/customers.css";

const API_URL = "http://localhost/Vivanda/admin/backend/customers.php";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editCustomer, setEditCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar clientes
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        setError("Error al cargar clientes");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // 🔍 Filtrar clientes
  const filteredCustomers = customers.filter((c) =>
    `${c.nombres} ${c.apellidos}`.toLowerCase().includes(search.toLowerCase()) ||
    (c.correo || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono || "").includes(search)
  );

  // ✏️ Guardar cambios
  const handleSave = async () => {
    if (!editCustomer) return;
    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCustomer),
      });
      const data = await res.json();

      if (data.status === "success") {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id_cliente === editCustomer.id_cliente ? editCustomer : c
          )
        );
        setEditCustomer(null);
      } else {
        setError(data.message || "Error al guardar cambios");
      }
    } catch {
      setError("Error de red al guardar");
    }
  };

  // 🗑️ Eliminar cliente
  const handleDelete = async (id_cliente) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      const res = await fetch(`${API_URL}?id_cliente=${id_cliente}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === "success") {
        setCustomers(customers.filter((c) => c.id_cliente !== id_cliente));
      } else {
        setError(data.message || "Error al eliminar");
      }
    } catch {
      setError("Error de red al eliminar");
    }
  };

  // 🟢 Cambiar estado (Activo/Inactivo)
  const handleStatusChange = async (customer, newStatus) => {
    const updatedCustomer = { ...customer, status: newStatus };
    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCustomer),
      });
      const data = await res.json();

      if (data.status === "success") {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id_cliente === customer.id_cliente
              ? { ...c, status: newStatus }
              : c
          )
        );
      } else {
        setError(data.message || "Error al actualizar estado");
      }
    } catch {
      setError("Error al cambiar estado");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <h1>Clientes</h1>

        <div className="customers-top">
          <input
            type="text"
            placeholder="Buscar cliente por nombre, correo o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p>Cargando clientes...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="customers-table-wrapper">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div key={customer.id_cliente} className="customer-section">
                <div className="customer-top">
                  <input
                    type="text"
                    value={
                      editCustomer?.id_cliente === customer.id_cliente
                        ? editCustomer.nombres
                        : customer.nombres
                    }
                    onChange={(e) =>
                      editCustomer?.id_cliente === customer.id_cliente &&
                      setEditCustomer({
                        ...editCustomer,
                        nombres: e.target.value,
                      })
                    }
                    readOnly={editCustomer?.id_cliente !== customer.id_cliente}
                  />

                  <input
                    type="text"
                    value={
                      editCustomer?.id_cliente === customer.id_cliente
                        ? editCustomer.apellidos
                        : customer.apellidos
                    }
                    onChange={(e) =>
                      editCustomer?.id_cliente === customer.id_cliente &&
                      setEditCustomer({
                        ...editCustomer,
                        apellidos: e.target.value,
                      })
                    }
                    readOnly={editCustomer?.id_cliente !== customer.id_cliente}
                  />

                  <input
                    type="email"
                    value={
                      editCustomer?.id_cliente === customer.id_cliente
                        ? editCustomer.correo
                        : customer.correo
                    }
                    onChange={(e) =>
                      editCustomer?.id_cliente === customer.id_cliente &&
                      setEditCustomer({
                        ...editCustomer,
                        correo: e.target.value,
                      })
                    }
                    readOnly={editCustomer?.id_cliente !== customer.id_cliente}
                  />

                  <input
                    type="text"
                    value={
                      editCustomer?.id_cliente === customer.id_cliente
                        ? editCustomer.telefono
                        : customer.telefono
                    }
                    onChange={(e) =>
                      editCustomer?.id_cliente === customer.id_cliente &&
                      setEditCustomer({
                        ...editCustomer,
                        telefono: e.target.value,
                      })
                    }
                    readOnly={editCustomer?.id_cliente !== customer.id_cliente}
                  />

                  <span className="customer-date">
                    {new Date(customer.fecha_registro).toLocaleDateString()}
                  </span>

                  <select
                    value={customer.status === 1 || customer.status === "activo" ? "activo" : "inactivo"}
                    onChange={(e) => handleStatusChange(customer, e.target.value)}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>

                  {editCustomer?.id_cliente === customer.id_cliente ? (
                    <button className="btn-save" onClick={handleSave}>
                      Guardar
                    </button>
                  ) : (
                    <button
                      className="btn-edit"
                      onClick={() => setEditCustomer({ ...customer })}
                    >
                      Editar
                    </button>
                  )}
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(customer.id_cliente)}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay clientes registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
