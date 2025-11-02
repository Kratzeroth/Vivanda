import { Header } from "./header";
import heroImg from "../src/assets/hero.png";
import "../src/assets/CSS/Home.css";
import { useRef, useState, useEffect, useCallback } from "react";
import { Footer } from "./footer";
import { useNavigate } from "react-router-dom";
import { Assistant } from "./Assistant"; // Asegúrate que esta ruta sea correcta

const useCarouselScroll = (scrollStep = 220) => {
  const ref = useRef(null);
  const scrollPrev = useCallback(() => {
    ref.current?.scrollBy({ left: -scrollStep, behavior: "smooth" });
  }, [scrollStep]);
  const scrollNext = useCallback(() => {
    ref.current?.scrollBy({ left: scrollStep, behavior: "smooth" });
  }, [scrollStep]);
  return [ref, scrollPrev, scrollNext];
};

const ProductCard = ({ item, navigate, extraClass = "" }) => {
  const safeDiscount = Number(item.discount) || 0;
  
  return (
    <div 
        className={`product-card ${extraClass}`} 
        onClick={() => navigate(`/product/${item.id}`)}
    >
        {safeDiscount > 0 && <div className="discount-badge">-{safeDiscount.toFixed(0)}%</div>}
        <img src={item.img} alt={item.name} />
        <div className="product-info">
            <p className="product-name">{item.name}</p>
            <div className="price-group">
                <p className="product-price">S/. {item.price.toFixed(2)}</p>
                {item.oldPrice && <p className="product-old-price">S/. {item.oldPrice.toFixed(2)}</p>}
            </div>
        </div>
        <button 
            className="add-to-cart-btn" 
            onClick={(e) => {
                e.stopPropagation(); 
                alert(`Añadido al carrito: ${item.name}`); 
            }}
        >
            🛒 Agregar
        </button>
    </div>
  );
};

const ProductCarousel = ({ title, items, itemRef, scrollPrev, scrollNext, navigate }) => {
    if (!items || items.length === 0) return null;
    
    return (
        <section className="carousel-section">
            <h2>{title}</h2>
            <div className="carousel-wrapper">
                <button className="carousel-btn left" onClick={scrollPrev}>‹</button>
                <div className="carousel" ref={itemRef}>
                    {items.map(item => (
                        <ProductCard 
                            key={item.id} 
                            item={item} 
                            navigate={navigate} 
                            extraClass={title.toLowerCase().replace(/\s/g, '-') + '-card'}
                        />
                    ))}
                </div>
                <button className="carousel-btn right" onClick={scrollNext}>›</button>
            </div>
        </section>
    );
};

export const Home = () => {
  const navigate = useNavigate();

  const [categoryRef, scrollCategoryPrev, scrollCategoryNext] = useCarouselScroll();
  const [bestSellersRef, scrollBestSellersPrev, scrollBestSellersNext] = useCarouselScroll();
  const [offersRef, scrollOffersPrev, scrollOffersNext] = useCarouselScroll();
  const [featuredRef, scrollFeaturedPrev, scrollFeaturedNext] = useCarouselScroll();
  const [newProductsRef, scrollNewProductsPrev, scrollNewProductsNext] = useCarouselScroll();
  const [recommendedRef, scrollRecommendedPrev, scrollRecommendedNext] = useCarouselScroll();
  const [seasonRef, scrollSeasonPrev, scrollSeasonNext] = useCarouselScroll();

  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const scrollStep = 220;

  useEffect(() => {
    const fallbackProducts = [
      { id: 1, name: "Manzanas", price: 5.00, oldPrice: 6.00, img: heroImg, discount: 16.67 },
      { id: 2, name: "Leche Gloria 1L", price: 3.00, oldPrice: 4.00, img: heroImg, discount: 25.00 },
      { id: 3, name: "Pan Integral", price: 2.00, oldPrice: null, img: heroImg, discount: 0 },
      { id: 4, name: "Arroz Costeño 5kg", price: 6.00, oldPrice: null, img: heroImg, discount: 0 },
      { id: 5, name: "Jugo Naranja Frugos", price: 8.00, oldPrice: 9.00, img: heroImg, discount: 11.11 },
      { id: 6, name: "Sandía Fresca", price: 10.00, oldPrice: 12.00, img: heroImg, discount: 16.67 },
      { id: 7, name: "Pollo Entero", price: 18.00, oldPrice: null, img: heroImg, discount: 0 },
      { id: 8, name: "Palta Hass", price: 9.00, oldPrice: 11.00, img: heroImg, discount: 18.18 },
      { id: 9, name: "Yogurt Griego", price: 4.50, oldPrice: null, img: heroImg, discount: 0 },
      { id: 10, name: "Filete Salmón", price: 25.00, oldPrice: 30.00, img: heroImg, discount: 16.67 }
    ];

    fetch("http://localhost/Vivanda/cliente/backend/cats.php")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setCategories(data.data.map(c => ({
            id: c.id_categoria,
            name: c.nombre_categoria,
            img: c.imagen_url ? `/${c.imagen_url}` : heroImg
          })));
        }
      })
      .catch(() => setCategories(fallbackProducts.slice(0, 6).map((p, i) => ({ id: i + 1, name: p.name.split(' ')[0], img: heroImg }))));

    fetch("http://localhost/Vivanda/cliente/backend/prod_all.php")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          const promoMap = {};
          data.promotions?.forEach(p => promoMap[p.id_producto] = p.descuento_porcentaje);

          const allProductsMapped = data.products.map(p => {
            const discountPercent = promoMap[p.id_producto] || 0;
            const hasDiscount = discountPercent > 0;
            const price = parseFloat(p.precio);
            const discountedPrice = hasDiscount ? price * (1 - discountPercent / 100) : price;
            return {
              id: p.id_producto,
              name: p.nombre_producto,
              price: discountedPrice,
              oldPrice: hasDiscount ? price : null,
              discount: Number(hasDiscount ? discountPercent : 0),
              img: p.imagen_url ? `/${p.imagen_url}` : heroImg
            };
          });

          const conOferta = allProductsMapped.filter(p => p.discount > 0).sort((a, b) => b.discount - a.discount);

          setFeatured(allProductsMapped.filter(p => p.destacado === "1" || p.destacado === 1).slice(0, 8));
          setPromotions(conOferta.slice(0, 4));
          setOffers(conOferta.slice(4, 8));
          setBestSellers(allProductsMapped.slice(0, 8));
          setNewProducts(allProductsMapped.slice(allProductsMapped.length - 8).filter((_, i) => i % 2 === 0).slice(0, 8));
          setRecommendations(allProductsMapped.slice(2, 10));
          setSeasonalProducts(allProductsMapped.filter((_, i) => i % 3 === 0).slice(0, 8));
          setFlashDeals(conOferta.slice(0, 6));

        }
      })
      .catch(() => {
        setFeatured(fallbackProducts.slice(0, 6));
        setPromotions(fallbackProducts.filter(p => p.oldPrice).slice(0, 4));
        setRecommendations(fallbackProducts.slice(0, 4));
        setBestSellers(fallbackProducts);
        setOffers(fallbackProducts.slice(0, 4));
        setNewProducts(fallbackProducts.slice(1, 5));
        setSeasonalProducts(fallbackProducts.slice(4, 9));
        setFlashDeals(fallbackProducts.slice(0, 6).filter(p => p.oldPrice));
      });
  }, []);

  const renderBanner = (text, btnText = "Ver ofertas", url = "/products") => (
    <div className="banner" style={{ backgroundImage: `url(${heroImg})` }}>
      <h2 className="banner-text">{text}</h2>
      <button className="banner-btn" onClick={() => navigate(url)}>{btnText}</button>
    </div>
  );

  return (
    <div className="home-container">
      <Header />

      <section className="hero-section">
        <div className="hero-text">
          <h1>Frescura y calidad directo a tu mesa</h1>
          <p>Compra online en Vivanda y recibe tus productos frescos en minutos.</p>
          <button onClick={() => navigate("/products")}>🛒 Comprar Ahora</button>
        </div>
        <div className="hero-img-container">
          <img src={heroImg} alt="Hero" />
        </div>
      </section>

      <section className="categories-section">
        <h2>🛍️ Explora Nuestras Categorías</h2>
        <div className="carousel-wrapper">
          <button className="carousel-btn left" onClick={scrollCategoryPrev}>‹</button>
          <div className="categories-container" ref={categoryRef}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              >
                <img src={cat.img} alt={cat.name} />
                <p>{cat.name}</p>
              </div>
            ))}
          </div>
          <button className="carousel-btn right" onClick={scrollCategoryNext}>›</button>
        </div>
      </section>

      <section className="values-section">
        <h2>¿Por qué elegir Vivanda?</h2>
        <div className="values-grid">
            <div className="value-item">
                <h3>🚚 Entrega Rápida</h3>
                <p>Recibe tus productos en menos de 90 minutos en zonas seleccionadas.</p>
            </div>
            <div className="value-item">
                <h3>⭐ Calidad Garantizada</h3>
                <p>Seleccionamos los productos más frescos del mercado.</p>
            </div>
            <div className="value-item">
                <h3>🔒 Pago Seguro</h3>
                <p>Transacciones protegidas con los más altos estándares de seguridad.</p>
            </div>
        </div>
      </section>
      
      {flashDeals.length > 0 && (
          <section className="flash-deals-section">
              <h2>⚡ Ofertas Relámpago (¡Tiempo Limitado!)</h2>
              <div className="countdown-timer">Tiempo restante: **02h 30m 15s**</div>
              <ProductCarousel
                  title=""
                  items={flashDeals}
                  itemRef={offersRef}
                  scrollPrev={scrollOffersPrev}
                  scrollNext={scrollOffersNext}
                  navigate={navigate}
              />
          </section>
      )}

      {renderBanner("¡No te pierdas nuestras promociones exclusivas!")}

      <section className="section-1">
        <div className="section-grid">
          <div className="section-subgroup">
            <h2>Recomendaciones de IA</h2>
            <div className="grid-2x2">
              {recommendations.slice(0, 4).map(r => <ProductCard key={r.id} item={r} navigate={navigate} extraClass="recommendation-card" />)}
            </div>
          </div>
          <div className="section-subgroup">
            <h2>Promociones</h2>
            <div className="grid-2x2">
              {promotions.slice(0, 4).map(p => <ProductCard key={p.id} item={p} navigate={navigate} extraClass="promotion-card" />)}
            </div>
          </div>
        </div>
      </section>

      {renderBanner("¡Ofertas de la Semana!")}

      <ProductCarousel
          title="🏆 Lo Más Vendido"
          items={bestSellers}
          itemRef={bestSellersRef}
          scrollPrev={scrollBestSellersPrev}
          scrollNext={scrollBestSellersNext}
          navigate={navigate}
      />
      
      <ProductCarousel
          title="🍉 Productos de Temporada"
          items={seasonalProducts}
          itemRef={seasonRef}
          scrollPrev={scrollSeasonPrev}
          scrollNext={scrollSeasonNext}
          navigate={navigate}
      />

      <section className="section-3">
        <h2>Ofertas de la Semana</h2>
        <div className="grid-2x2">
          {offers.slice(0, 4).map(o => <ProductCard key={o.id} item={o} navigate={navigate} extraClass="offer-card" />)}
        </div>
      </section>

      {renderBanner("¡Recibe productos frescos y promociones!")}

      <section className="subscribe-section">
        <h2>📧 Suscríbete y Ahorra</h2>
        <p>Sé el primero en recibir ofertas, novedades y promociones exclusivas. ¡No te las pierdas!</p>
        <div className="subscribe-form">
          <input type="email" placeholder="Ingresa tu correo electrónico..." />
          <button>Suscribirse</button>
        </div>
      </section>

      <ProductCarousel
          title="✨ Productos Destacados"
          items={featured}
          itemRef={featuredRef}
          scrollPrev={scrollFeaturedPrev}
          scrollNext={scrollFeaturedNext}
          navigate={navigate}
      />

      <ProductCarousel
          title="🆕 Novedades en Vivanda"
          items={newProducts}
          itemRef={newProductsRef}
          scrollPrev={scrollNewProductsPrev}
          scrollNext={scrollNewProductsNext}
          navigate={navigate}
      />

      <ProductCarousel
          title="🤖 Recomendados para Ti"
          items={recommendations}
          itemRef={recommendedRef}
          scrollPrev={scrollRecommendedPrev}
          scrollNext={scrollRecommendedNext}
          navigate={navigate}
      />

    
      <Assistant 
          isOpen={assistantOpen} 
          setIsOpen={setAssistantOpen} 
      />

      <Footer />
    </div>
  );
};