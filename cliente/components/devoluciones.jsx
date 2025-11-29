import { Header } from "./header";
import heroImg from "../src/assets/hero.png"; 
// Asegúrate de que la ruta a Devoluciones.css sea correcta
import "../src/assets/CSS/Devoluciones.css"; 
import { useRef, useState, useEffect, useCallback } from "react";
import { Footer } from "./footer";
import { useNavigate } from "react-router-dom";


// -------------------- Funciones Reutilizables --------------------

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

const ProductCarousel = ({ title, items, itemRef, scrollPrev, scrollNext, navigate, cardClass }) => {
    if (!items || items.length === 0) return null;
    
    return (
        <section className="carousel-section">
            <h2>{title} </h2>
            <div className="carousel-wrapper">
                <button className="carousel-btn left" onClick={scrollPrev}>‹</button>
                <div className="carousel" ref={itemRef}>
                    {items.map(item => (
                        <ProductCard 
                            key={item.id} 
                            item={item} 
                            navigate={navigate} 
                            extraClass={cardClass}
                        />
                    ))}
                </div>
                <button className="carousel-btn right" onClick={scrollNext}>›</button>
            </div>
        </section>
    );
};


// -------------------- Modal de Solicitud de Devolución --------------------

const ReturnRequestModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        orderId: '',
        productName: '',
        reason: '',
        details: ''
    });

    // Esta es la clave: si isOpen es false, el componente NO renderiza nada.
    if (!isOpen) return null; 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Simulación: Aquí iría la lógica de envío a la API
        alert(`✅ Solicitud enviada (Simulación).\nOrden: ${formData.orderId}\nProducto: ${formData.productName}\nMotivo: ${formData.reason}`);
        
        // Limpiar formulario y cerrar modal
        setFormData({ orderId: '', productName: '', reason: '', details: '' });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>📝 Iniciar Nueva Solicitud de Devolución</h2>
                <p>Por favor, completa los siguientes campos para procesar tu devolución.</p>

                <form onSubmit={handleSubmit} className="return-form">
                    <div className="form-group">
                        <label htmlFor="orderId">Número de Orden *</label>
                        <input
                            type="text"
                            id="orderId"
                            name="orderId"
                            value={formData.orderId}
                            onChange={handleChange}
                            required
                            placeholder="Ej: #987654321"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="productName">Producto a Devolver *</label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Televisor Smart 50'' (Simulado: en producción sería un select)"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="reason">Motivo Principal *</label>
                        <select
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona un motivo</option>
                            <option value="Talla/Medida incorrecta">Talla/Medida incorrecta</option>
                            <option value="Producto dañado/defectuoso">Producto dañado/defectuoso</option>
                            <option value="Ya no lo necesito/Quiero otro">Ya no lo necesito/Quiero otro</option>
                            <option value="Descripción incorrecta">Descripción incorrecta en web</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="details">Detalles Adicionales (Opcional)</label>
                        <textarea
                            id="details"
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe brevemente el problema."
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-return-btn">
                        Enviar Solicitud
                    </button>
                </form>
            </div>
        </div>
    );
};


// -------------------- Componente Principal de la Página --------------------

export const Devoluciones = () => {
  const navigate = useNavigate();
  
  // Estado para controlar el modal:
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Hooks para los carruseles
  const [userReturnsRef, scrollUserReturnsPrev, scrollUserReturnsNext] = useCarouselScroll(); 
  const [exclusiveProductsRef, scrollExclusiveProductsPrev, scrollExclusiveProductsNext] = useCarouselScroll(); 
  
  const [userReturnedProducts, setUserReturnedProducts] = useState([]); 
  const [exclusiveProducts, setExclusiveProducts] = useState([]); 

  useEffect(() => {
    // SIMULACIÓN: Historial de devoluciones del usuario
    const userReturnsFallback = [
      { id: 101, name: "Zapatillas Deportivas", price: 0.00, oldPrice: 150.00, img: heroImg, discount: 0, reason: "Talla incorrecta" },
      { id: 102, name: "Televisor Smart 50''", price: 0.00, oldPrice: 1200.00, img: heroImg, discount: 0, reason: "Defecto en el panel" },
      { id: 103, name: "Licuadora Industrial", price: 0.00, oldPrice: 80.00, img: heroImg, discount: 0, reason: "Insatisfacción" },
    ];
    setUserReturnedProducts(userReturnsFallback);
    
    // SIMULACIÓN: Artículos Exclusivos (Productos de remate que queremos vender)
    const exclusiveFallback = [
      { id: 1, name: "Manzanas Exclusivas", price: 3.50, oldPrice: 6.00, img: heroImg, discount: 41.67 },
      { id: 2, name: "Leche Ultra Fresca", price: 2.50, oldPrice: 4.00, img: heroImg, discount: 37.50 },
      { id: 3, name: "Pan de Campo Único", price: 1.50, oldPrice: null, img: heroImg, discount: 0 },
    ];

    // Lógica de API (mantenida de los ejemplos anteriores)
    fetch("http://localhost/Vivanda/cliente/backend/prod_all.php")
      .then(res => res.json())
      .then(data => {
        // ...
      })
      .catch(() => {
        setExclusiveProducts(exclusiveFallback
          .map(p => ({
            ...p,
            name: `✨ Único - ${p.name}`, 
            oldPrice: p.price * 1.5,
            price: p.price,
            discount: 33
          })));
      });
  }, []);


  return (
    <div className="devoluciones-page-container">
      <Header />

      {/* -------------------- SECCIÓN 1: MIS DEVOLUCIONES (Historial del Usuario) -------------------- */}
      <section className="page-hero-returns">
        <h1>Mis Devoluciones y Garantías</h1>
        <p>Aquí puedes ver el estado de tus devoluciones pendientes y el historial de artículos que has devuelto. **Tu satisfacción es nuestra prioridad.**</p>
        <button onClick={() => setIsModalOpen(true)}>Iniciar Nueva Solicitud</button>
      </section>
      
      <section className="carousel-section" style={{ padding: '40px 5%' }}>
          <h2>Artículos Devueltos Recientemente por ti</h2>
          <div className="carousel-wrapper">
              <div className="carousel" ref={userReturnsRef} style={{ gap: '40px', justifyContent: 'center' }}>
                  {userReturnedProducts.map(item => (
                      <div key={item.id} className="product-card user-returned-card">
                          <img src={item.img} alt={item.name} />
                          <div className="product-info">
                            <p className="product-name">{item.name}</p>
                            <p style={{ fontSize: '14px', color: '#888' }}>Devuelto por: **{item.reason}**</p>
                            <p style={{ fontWeight: 'bold', color: '#E74C3C', marginTop: '10px' }}>ESTADO: Procesado</p>
                          </div>
                          <button 
                            className="add-to-cart-btn" 
                            style={{ backgroundColor: '#ccc', color: '#666' }}
                          >
                            Ver Detalles de Caso
                          </button>
                      </div>
                  ))}
              </div>
          </div>

          {userReturnedProducts.length === 0 && (
              <p className="no-products-message" style={{ color: '#1A4D2E' }}>🎉 ¡Felicidades! No tienes devoluciones recientes pendientes.</p>
          )}
      </section>

      {/* -------------------- SECCIÓN 2: VENTA SUTIL (Artículos Exclusivos) -------------------- */}
      <section className="flash-deals-section" style={{ margin: '60px 0' }}>
          <h2 style={{ color: '#E74C3C' }}>✨ Descubre Artículos Exclusivos con Precio Único</h2>
          <p style={{ color: '#555', fontSize: '18px', textAlign: 'center' }}>Productos seleccionados por su disponibilidad limitada o precio especial. ¡Consíguelos antes de que se agoten!</p>
          
          <ProductCarousel
            title="Ahorra en estos favoritos"
            items={exclusiveProducts}
            itemRef={exclusiveProductsRef}
            scrollPrev={scrollExclusiveProductsPrev}
            scrollNext={scrollExclusiveProductsNext}
            cardClass="returned-product-card" 
            navigate={navigate}
          />

          {exclusiveProducts.length === 0 && (
            <p className="no-products-message">No hay artículos exclusivos disponibles en este momento.</p>
          )}

      </section>

      <Footer />

   
      <ReturnRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};