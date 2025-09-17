import { Header } from "./header";
import heroImg from "../src/assets/hero.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/assets/CSS/home.css";
import { useRef, useState, useEffect } from "react";
import { Footer } from "./footer";

const categories = [
  { id: 1, name: "Frutas", img: "../src/assets/categorias/frutas.png" },
  { id: 2, name: "Verduras", img: "../src/assets/categorias/verduras.png" },
  { id: 3, name: "Lácteos", img: "../src/assets/categorias/lacteos.png" },
  { id: 4, name: "Bebidas", img: "../src/assets/categorias/bebidas.png" },
  { id: 5, name: "Snacks", img: "../src/assets/categorias/snacks.png" },
  { id: 6, name: "Higiene", img: "../src/assets/categorias/higiene.png" },
];

const featuredProducts = [
  { id: 1, name: "Manzana", price: "S/ 5.00", img: "../src/assets/categorias/higiene.png" },
  { id: 2, name: "Leche", price: "S/ 6.50", img: "../src/assets/categorias/higiene.png" },
  { id: 3, name: "Pan", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
  { id: 4, name: "Pan", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
  { id: 5, name: "Pan", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
  { id: 5, name: "Pan", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
  { id: 5, name: "333", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
  { id: 5, name: "Pan", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
  { id: 5, name: "Pan", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
  { id: 5, name: "Pan", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
  { id: 5, name: "Pan", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
  { id: 5, name: "Pan", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
  { id: 5, name: "123", price: "S/ 3.00", img: "../src/assets/categorias/higiene.png" },
];

export const Home = () => {
  const containerRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [maxScrollX, setMaxScrollX] = useState(0);

  const step = 180; // tamaño del desplazamiento en px

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

  const nextSlide = () => {
    setScrollX((prev) => {
      const next = prev + step;
      return next > maxScrollX ? 0 : next; // reinicia si llegó al final
    });
  };

  const prevSlide = () => {
    setScrollX((prev) => {
      const prevPos = prev - step;
      return prevPos < 0 ? maxScrollX : prevPos; // va al final si retrocede más allá del inicio
    });
  };

  return (
    <div className="home-container">
      <Header />
      <section className="hero-section">
        <div className="hero-card">
          <div className="hero-text">
            <h1>Frescura y calidad directo a tu mesa</h1>
            <p>Compra online en Vivanda y recibe tus productos en minutos.</p>
            <button className="btn btn-primary btn-lg hero-btn">
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
            <div key={cat.id} className="category-card">
              <img src={cat.img} alt={cat.name} />
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="products-section">
        <h2 className="products-title">Productos Destacados Semanal</h2>
        <button onClick={prevSlide} className="btn btn-light btn-next btn-carrusel">
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
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.img} alt={product.name} />
              <div className="product-info">
                <span className="product-name">{product.name}</span>
                <span className="product-price">{product.price}</span>
                <button className="product-btn">Comprar</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={nextSlide} className="btn btn-light btn-previous btn-carrusel">
          <i className="bi bi-arrow-right"></i>
        </button>
      </section>

      <Footer />
    </div>
  );
<<<<<<< HEAD
}
=======
};
>>>>>>> 0054bc7 (integracion del main)
