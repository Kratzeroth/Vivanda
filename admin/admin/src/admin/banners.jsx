import { useState } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import "../assets/css/banners.css";

const initialBanners = [
  { id: 1, title: "Oferta 1", image: "https://plazavea.vteximg.com.br/arquivos/Banner-Top-MP-D.png?v=637076373493930000", status: "activo" },
  { id: 2, title: "Oferta 2", image: "https://m.plazavea.com.pe/repositorioaps/0/0/jer/-1/images/BANNER-WEB_finalll.jpg", status: "inactivo" },
];

export default function Banners() {
  const [banners, setBanners] = useState(initialBanners);

  const handleImageChange = (e, banner) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setBanners(banners.map(b => b.id === banner.id ? { ...b, image: url } : b));
    }
  };

  const handleURLChange = (e, banner) => {
    const url = e.target.value;
    setBanners(banners.map(b => b.id === banner.id ? { ...b, image: url } : b));
  };

  const toggleStatus = (banner) => {
    setBanners(banners.map(b => b.id === banner.id ? { ...b, status: b.status === "activo" ? "inactivo" : "activo" } : b));
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <h1>Banners</h1>
        {banners.map(banner => (
          <div key={banner.id} className="banner-section">
            <div className="banner-top">
              <input type="text" value={banner.title} readOnly className="banner-title" />
              <select value={banner.status} onChange={() => toggleStatus(banner)}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <input type="text" value={banner.image} onChange={e => handleURLChange(e, banner)} placeholder="URL del banner" />
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, banner)} />
            </div>
            <div className="banner-image">
              <img src={banner.image} alt={banner.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
