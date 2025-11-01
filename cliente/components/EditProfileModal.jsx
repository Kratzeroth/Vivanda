import { useState, useEffect } from "react";


export const EditProfileModal = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombres: user.nombres,
    apellidos: user.apellidos,
    telefono: user.telefono,
    correo: user.correo,
    foto_perfil: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user.foto_perfil) {
      setPreview(`http://localhost/Vivanda/vivanda/backend/${user.foto_perfil}`);
    } else {
      setPreview(null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("id_usuario", user.id_usuario);

    fetch("http://localhost/Vivanda/vivanda/backend/update_user.php", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        alert(result.message);
        if (result.status === "success") onUpdate();
      })
      .catch(() => alert("Error al actualizar perfil"));
  };

  return (
    <div
      className="modal fade"
      id="editProfileModal"
      tabIndex="-1"
      aria-labelledby="editProfileModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "900px", width: "90vw" }}>
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden p-0 bg-white"
          style={{
            minHeight: "100%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            margin: "0 auto",
          }}>
          <div
            className="modal-header text-white px-4 py-3"
            style={{
              background: "linear-gradient(135deg, #ff4d4d 0%, #ff7070 100%)",
              borderBottom: "none",
              justifyContent: "center",
            }}
          >
            <h4 className="modal-title fw-bold text-center w-100" id="editProfileModalLabel" style={{ fontSize: "1.3rem", letterSpacing: "0.5px" }}>
              Editar Perfil
            </h4>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            {/* Avatar centrado arriba */}
            <div className="d-flex flex-column align-items-center justify-content-center mb-4">
              <div
                className="rounded-circle shadow border border-3 border-danger mb-2 d-flex align-items-center justify-content-center bg-light"
                style={{
                  width: "150px",
                  height: "150px",
                  overflow: "hidden",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                    <i className="bi bi-person-circle" style={{ fontSize: "5rem" }}></i>
                  </div>
                )}
              </div>
              <label
                htmlFor="fotoInput"
                className="btn btn-outline-danger btn-sm mt-2 px-3 fw-semibold"
                style={{ borderRadius: "20px" }}
              >
                Cambiar foto
              </label>
              <input
                id="fotoInput"
                type="file"
                className="d-none"
                name="foto_perfil"
                onChange={handleChange}
                accept="image/*"
              />
            </div>

            {/* Campos debajo del avatar */}
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-start w-100" style={{ fontSize: "1rem" }}>Nombres</label>
                <input
                  type="text"
                  className="form-control text-start shadow-sm"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                  style={{ fontSize: "1rem" }}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-start w-100" style={{ fontSize: "1rem" }}>Apellidos</label>
                <input
                  type="text"
                  className="form-control text-start shadow-sm"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  required
                  style={{ fontSize: "1rem" }}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-start w-100" style={{ fontSize: "1rem" }}>Teléfono</label>
                <input
                  type="text"
                  className="form-control text-start shadow-sm"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+51 999 999 999"
                  style={{ fontSize: "1rem" }}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-start w-100" style={{ fontSize: "1rem" }}>Correo</label>
                <input
                  type="email"
                  className="form-control text-start shadow-sm"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                  style={{ fontSize: "1rem" }}
                />
              </div>
            </div>

            <div className="modal-footer border-0 mt-4 d-flex flex-column flex-md-row justify-content-end gap-2 px-0">
              <button
                type="button"
                className="btn btn-light border px-4 py-2 fw-semibold shadow-sm"
                data-bs-dismiss="modal"
                style={{ borderRadius: "20px", fontSize: "1rem" }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-danger px-4 py-2 fw-semibold shadow-sm"
                style={{ borderRadius: "20px", fontSize: "1rem" }}
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
