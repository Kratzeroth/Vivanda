import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import "../src/assets/CSS/offers.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Carousel } from 'bootstrap';

export const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    // Traer banners
    fetch("http://localhost/Vivanda/admin/backend/banners.php")
      .then((res) => res.json())
      .then((data) => {
        setBanners(Array.isArray(data) ? data.filter(b => b.activo !== 0) : []);
      })
      .catch((err) => console.error("Error cargando banners:", err));

    // Traer ofertas
    fetch("http://localhost/Vivanda/cliente/backend/prod_all.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const promoMap = {};
          data.promotions.forEach((p) => {
            promoMap[p.id_producto] = p.descuento_porcentaje;
          });

          const mapped = data.products
            .filter((p) => promoMap[p.id_producto])
            .map((p) => {
              const discountPercent = promoMap[p.id_producto];
              const discountedPrice = parseFloat(p.precio) * (1 - discountPercent / 100);

              return {
                id: p.id_producto,
                title: p.nombre_producto,
                description: p.descripcion,
                price: `S/ ${discountedPrice.toFixed(2)}`,
                discount: `-${discountPercent}%`,
                image: p.imagen_url ? `/${p.imagen_url}` : "images/productos/default.png",
                category: p.categoria_nombre
              };
            });

          setOffers(mapped);
          setCategories([...new Set(mapped.map((p) => p.category))]);
        }
      })
      .catch((err) => console.error("Error cargando ofertas:", err));
  }, []);

  useEffect(() => {
    // Inicializar carrusel manualmente cuando banners cambian
    const carouselElement = document.getElementById('carouselExampleDark');
    if (carouselElement && banners.length > 0) {
      new Carousel(carouselElement, {
        interval: 2000,
        ride: 'carousel'
      });
    }
  }, [banners]);

  return (
    <>
      <Header />

      {/* Carrusel dinámico con banners de la base de datos */}
      <section className="offers-carousel">
        <div id="carouselExampleDark" className="carousel carousel-dark slide">
          <div className="carousel-indicators">
            {banners.map((b, idx) => (
              <button
                key={b.id_banner}
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide-to={idx}
                className={idx === 0 ? "active" : ""}
                aria-current={idx === 0 ? "true" : undefined}
                aria-label={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {banners.map((b, idx) => (
              <div className={`carousel-item${idx === 0 ? " active" : ""}`} key={b.id_banner}>
                <img
                  src={`/${b.imagen_url}`}
                  className="d-block w-100 carousel-main-img"
                  alt={b.titulo || `Banner ${idx + 1}`}
                />
                {b.titulo && (
                  <div className="carousel-caption d-none d-md-block">
                    <h5>{b.titulo}</h5>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Productos por categoría en cuadrícula */}
      {categories.map((cat) => (
        <section className="offers-category" key={cat}>
          <h2>{cat}</h2>
          <div className="offers-grid">
            {offers
              .filter((item) => item.category === cat)
              .map((item) => (
                <div className="offer-card" key={item.id}>
                  <div className="img-container">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="offer-info">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="discount">{item.discount}</span>
                    <span className="price">{item.price}</span>
                    <button>Agregar al carrito</button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}

      <Footer />
    </>
  );
};
