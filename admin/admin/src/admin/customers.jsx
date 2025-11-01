import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/customers.css";

const CustomersData = [

  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "987654321", address: "Av. Principal 123", status: "activo" },
  { id: 2, name: "María López", email: "maria@example.com", phone: "912345678", address: "Calle Secundaria 456", status: "inactivo" },
  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "987654321", address: "Av. Principal 123", status: "activo" },
  { id: 2, name: "María López", email: "maria@example.com", phone: "912345678", address: "Calle Secundaria 456", status: "inactivo" },
  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "987654321", address: "Av. Principal 123", status: "activo" },
  { id: 2, name: "María López", email: "maria@example.com", phone: "912345678", address: "Calle Secundaria 456", status: "inactivo" },
  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "987654321", address: "Av. Principal 123", status: "activo" },
  { id: 2, name: "María López", email: "maria@example.com", phone: "912345678", address: "Calle Secundaria 456", status: "inactivo" },
  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "987654321", address: "Av. Principal 123", status: "activo" },
  { id: 2, name: "María López", email: "maria@example.com", phone: "912345678", address: "Calle Secundaria 456", status: "inactivo" },
  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "987654321", address: "Av. Principal 123", status: "activo" },
  { id: 2, name: "María López", email: "maria@example.com", phone: "912345678", address: "Calle Secundaria 456", status: "inactivo" },
  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "987654321", address: "Av. Principal 123", status: "activo" },
  { id: 2, name: "María López", email: "maria@example.com", phone: "912345678", address: "Calle Secundaria 456", status: "inactivo" },
];

export default function Customers() {
  const [customers, setCustomers] = useState(CustomersData);
  const [search, setSearch] = useState("");
  const [editCustomer, setEditCustomer] = useState(null);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleSave = () => {
    if (!editCustomer) return;
    setCustomers(customers.map(c => c.id === editCustomer.id ? editCustomer : c));
    setEditCustomer(null);
  };

  const handleEdit = (customer) => {
    setEditCustomer({ ...customer });
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const toggleStatus = (customer) => {
    setCustomers(customers.map(c => c.id === customer.id ? { ...c, status: c.status === "activo" ? "inactivo" : "activo" } : c));
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <h1>Clientes</h1>

        {/* Barra de búsqueda */}
        <div className="customers-top">
          <input
            type="text"
            placeholder="Buscar cliente por nombre, email o teléfono..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Tabla de clientes */}
        <div className="customers-table-wrapper">
          {filteredCustomers.map(customer => (
            <div key={customer.id} className="customer-section">
              <div className="customer-top">
                <input
                  type="text"
                  value={editCustomer?.id === customer.id ? editCustomer.name : customer.name}
                  onChange={e => editCustomer?.id === customer.id && setEditCustomer({ ...editCustomer, name: e.target.value })}
                  readOnly={editCustomer?.id !== customer.id}
                />
                <input
                  type="email"
                  value={editCustomer?.id === customer.id ? editCustomer.email : customer.email}
                  onChange={e => editCustomer?.id === customer.id && setEditCustomer({ ...editCustomer, email: e.target.value })}
                  readOnly={editCustomer?.id !== customer.id}
                />
                <input
                  type="text"
                  value={editCustomer?.id === customer.id ? editCustomer.phone : customer.phone}
                  onChange={e => editCustomer?.id === customer.id && setEditCustomer({ ...editCustomer, phone: e.target.value })}
                  readOnly={editCustomer?.id !== customer.id}
                />
                <input
                  type="text"
                  value={editCustomer?.id === customer.id ? editCustomer.address : customer.address}
                  onChange={e => editCustomer?.id === customer.id && setEditCustomer({ ...editCustomer, address: e.target.value })}
                  readOnly={editCustomer?.id !== customer.id}
                />
                <select
                  value={customer.status}
                  onChange={() => toggleStatus(customer)}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>

                {editCustomer?.id === customer.id ? (
                  <button className="btn-save" onClick={handleSave}>Guardar</button>
                ) : (
                  <button className="btn-edit" onClick={() => handleEdit(customer)}>Editar</button>
                )}
                <button className="btn-delete" onClick={() => handleDelete(customer.id)}>Borrar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
