// src/pages/UserProfile.jsx
import { Header } from "./header";
import { Footer } from "./footer";
import "../src/assets/CSS/userProfile.css";

// 🔹 Simulando datos de una API
const user = {
  id: 1,
  name: "Diego Tataje",
  bio: "Cliente frecuente en Vivanda | Amante del café y la tecnología",
  coverPhoto:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80",
  profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
};

const posts = [
  {
    id: 1,
    author: user.name,
    authorPhoto: user.profilePhoto,
    time: "Hace 2 horas",
    content: "Probando el nuevo café orgánico de Vivanda ☕ ¡Altamente recomendado!",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    author: user.name,
    authorPhoto: user.profilePhoto,
    time: "Ayer",
    content: "Compré frutas frescas en Vivanda y la calidad fue excelente 🍎🍇",
    image: null,
  },
];

export const UserProfile = () => {
  return (
    <>
      <Header />

      <div className="profile-container">
        {/* Portada */}
        <div className="profile-cover">
          <img src={user.coverPhoto} alt="Portada" />
        </div>

        {/* Sección principal */}
        <div className="profile-main">
          {/* Foto de perfil */}
          <div className="profile-photo">
            <img src={user.profilePhoto} alt={user.name} />
          </div>

          {/* Nombre e info */}
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.bio}</p>
            <button>Editar Perfil</button>
          </div>
        </div>

        {/* Menú estilo Facebook */}
        <nav className="profile-nav">
          <ul>
            <li className="active">Publicaciones</li>
            <li>Información</li>
            <li>Pedidos</li>
            <li>Favoritos</li>
            <li>Reseñas</li>
          </ul>
        </nav>

        {/* Contenido principal */}
        <div className="profile-content">
          {posts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-header">
                <img src={post.authorPhoto} alt={post.author} />
                <div>
                  <h3>{post.author}</h3>
                  <span>{post.time}</span>
                </div>
              </div>
              <p>{post.content}</p>
              {post.image && (
                <img src={post.image} alt="Publicación" className="post-image" />
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};
