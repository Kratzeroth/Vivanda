import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const Publicaciones = ({ usuario }) => {
  const [posts, setPosts] = useState([]);
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState(null);

  const fetchPosts = async () => {
    const res = await fetch("http://localhost/Vivanda/vivanda/backend/get_publi.php");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePublicar = async () => {
    if (!texto.trim() && !imagen) return alert("Escribe algo o agrega una imagen");

    const formData = new FormData();
    formData.append("id_usuario", usuario.id_usuario);
    formData.append("texto", texto);
    if (imagen) formData.append("imagen", imagen);

    const res = await fetch("http://localhost/Vivanda/vivanda/backend/publi.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setTexto("");
      setImagen(null);
      fetchPosts();
    } else {
      alert("Error al publicar");
    }
  };

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor((Math.abs(Math.sin(hash) * 16777215)) % 16777215);
    return `#${color.toString(16).padStart(6, "0")}`;
  };

  const getInitials = (nombre, apellido) => {
    return `${nombre?.charAt(0).toUpperCase() || ""}${apellido?.charAt(0).toUpperCase() || ""}`;
  };

  return (
    <div className="container">
      {/* Caja para crear publicación */}
      <div className="card shadow-sm p-3 mb-4 border-0" style={{ borderRadius: "15px" }}>
        <div className="d-flex align-items-center mb-3">
          {usuario.foto_perfil ? (
            <img
              src={`http://localhost/Vivanda/vivanda/backend/${usuario.foto_perfil}`}
              alt="perfil"
              className="rounded-circle me-3"
              width="50"
              height="50"
            />
          ) : (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
              style={{
                backgroundColor: stringToColor(usuario.nombres + usuario.apellidos),
                width: "50px",
                height: "50px",
              }}
            >
              {getInitials(usuario.nombres, usuario.apellidos)}
            </div>
          )}
          <input
            type="text"
            className="form-control rounded-pill"
            placeholder="¿Qué estás pensando?"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        {imagen && (
          <div className="text-center mb-3">
            <img
              src={URL.createObjectURL(imagen)}
              alt="preview"
              className="img-fluid rounded"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )}
        <div className="d-flex justify-content-between">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            className="form-control w-75"
          />
          <button className="btn btn-primary ms-2 px-4" onClick={handlePublicar}>
            Publicar
          </button>
        </div>
      </div>

      {/* Publicaciones estilo Facebook */}
      {posts.map((p) => (
        <div key={p.id_publicacion} className="card shadow-sm mb-4 border-0" style={{ borderRadius: "15px" }}>
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              {p.foto_perfil ? (
                <img
                  src={`http://localhost/Vivanda/vivanda/backend/${p.foto_perfil}`}
                  alt="perfil"
                  className="rounded-circle me-3"
                  width="50"
                  height="50"
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                  style={{
                    backgroundColor: stringToColor(p.nombres + p.apellidos),
                    width: "50px",
                    height: "50px",
                  }}
                >
                  {getInitials(p.nombres, p.apellidos)}
                </div>
              )}
              <div>
                <h6 className="mb-0">{p.nombres} {p.apellidos}</h6>
                <small className="text-muted">{new Date(p.fecha_publicacion).toLocaleString()}</small>
              </div>
            </div>
            <p className="mt-2 mb-3">{p.texto}</p>
            {p.imagen_url && (
              <img
                src={`http://localhost/Vivanda/vivanda/backend/${p.imagen_url}`}
                alt="Publicación"
                className="img-fluid rounded mb-2"
              />
            )}
            <div className="d-flex justify-content-around text-muted border-top pt-2">
              <span role="button">👍 Me gusta</span>
              <span role="button">💬 Comentar</span>
              <span role="button">↪️ Compartir</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
