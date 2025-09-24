import { Header } from "./header";
import heroImg from "../src/assets/hero.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/assets/CSS/home.css";
import { useRef, useState, useEffect } from "react";
import { Footer } from "./footer";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [maxScrollX, setMaxScrollX] = useState(0);

  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const step = 180;

  // calcular scroll
  useEffect(() => {
    const container = containerRef.current;
    const updateMaxScroll = () => {
      if (container) {
        const max = container.scrollWidth - container.clientWidth;
        setMaxScrollX(max > 0 ? max : 0);
      }
    };
    updateMaxScroll();
    const resizeObserver = new ResizeObserver(updateMaxScroll);
    if (container) resizeObserver.observe(container);
    window.addEventListener("resize", updateMaxScroll);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMaxScroll);
    };
  }, []);

  // cargar categorías
  useEffect(() => {
    fetch("http://localhost/Vivanda/Vivanda/backend/cats.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const mapped = data.data.map((c) => ({
            id: c.id_categoria,
            name: c.nombre_categoria,
            img: c.imagen_url
              ? `/${c.imagen_url}`
              : "images/categorias/default.png",
          }));
          setCategories(mapped);
        }
      })
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  // cargar productos destacados usando prod_all con descuentos
  useEffect(() => {
    fetch("http://localhost/Vivanda/Vivanda/backend/prod_all.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // Creamos un map id_producto => descuento
          const promoMap = {};
          data.promotions.forEach((p) => {
            promoMap[p.id_producto] = p.descuento_porcentaje;
          });

          const destacados = data.products.filter(
            (p) => p.destacado === "1" || p.destacado === 1
          );

          const mapped = destacados.map((p) => {
            const discountPercent = promoMap[p.id_producto] || 0;
            const hasDiscount = discountPercent > 0;
            const discountedPrice = hasDiscount
              ? parseFloat(p.precio) * (1 - discountPercent / 100)
              : parseFloat(p.precio);

            return {
              id: p.id_producto,
              name: p.nombre_producto,
              price: discountedPrice,
              oldPrice: hasDiscount ? parseFloat(p.precio) : null,
              discount: hasDiscount,
              discountPercent: discountPercent,
              img: p.imagen_url
                ? `/${p.imagen_url}`
                : "images/productos/default.png",
            };
          });

          setFeatured(mapped);
        }
      })
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  const nextSlide = () =>
    setScrollX((prev) => (prev + step > maxScrollX ? 0 : prev + step));
  const prevSlide = () =>
    setScrollX((prev) => (prev - step < 0 ? maxScrollX : prev - step));

  return (
    <div className="home-container">
      <Header />

      <section className="hero-section">
        <div className="hero-card">
          <div className="hero-text">
            <h1>Frescura y calidad directo a tu mesa</h1>
            <p>Compra online en Vivanda y recibe tus productos en minutos.</p>
            <button
              className="hero-btn btn-lg"
              onClick={() => navigate("/products")}
            >
              Ver productos
            </button>
          </div>
          <div className="hero-image">
            <img src={heroImg} alt="Producto destacado" />
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2 className="section-title">Categorías Destacadas</h2>
        <div className="categories-container">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() =>
                navigate(`/products?category=${encodeURIComponent(cat.name)}`)
              }
            >
              <img src={cat.img} alt={cat.name} />
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="products-section">
        <h2 className="products-title">Productos Destacados de la Semana</h2>
        <button
          onClick={prevSlide}
          className="btn btn-light btn-next btn-carrusel"
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <div
          className="products-container"
          ref={containerRef}
          style={{
            transform: `translateX(-${scrollX}px)`,
            transition: "transform 0.4s ease",
          }}
        >
          {featured.map((product) => (
            <div key={product.id} className="product-card">
              {product.discount && (
                <div className="discount-badge">
                  -{parseInt(product.discountPercent)}%
                </div>
              )}
              <img src={product.img} alt={product.name} />
              <div className="product-info">
                <span className="product-name">{product.name}</span>
                <div className="product-prices">
                  <span className="price-label">Precio</span>
                  <span className="price-value">S/ {product.price.toFixed(2)}</span>
                </div>
                <button
                  className="product-btn"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="btn btn-light btn-previous btn-carrusel"
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </section>

      <Footer />
    </div>
  );
};
