import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import "../src/assets/CSS/productDetail.css";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const user = JSON.parse(localStorage.getItem("usuario") || "null");

  useEffect(() => {
    fetch("http://localhost/Vivanda/Vivanda/backend/prod_all.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const discountSet = new Set(
            data.promotions.map((p) => p.id_producto)
          );
          const p = data.products.find((prod) => prod.id_producto == id);
          if (p) {
            setProduct({
              ...p,
              discount: discountSet.has(p.id_producto),
              rating: p.calificacion ? parseInt(p.calificacion) : 0,
              image: p.imagen_url
                ? `/${p.imagen_url}`
                : "images/productos/default.png",
            });
          }
        }
      })
      .catch((err) => console.error("Error cargando producto:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      setShowLoginAlert(true);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost/Vivanda/Vivanda/backend/cart.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: user.id,
            id_producto: product.id_producto,
            cantidad: quantity,
          }),
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        alert("✅ Producto agregado al carrito");
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert("❌ No se pudo agregar al carrito");
    }
  };

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  if (loading) return <p>Cargando producto...</p>;
  if (!product) return <p>Producto no encontrado</p>;

  return (
    <>
      <Header />
      <main className="product-detail-page">
        <div className="product-detail-container">
          {/* Imagen izquierda */}
          <div className="product-image-container">
            <img
              src={product.image}
              alt={product.nombre_producto}
              className="product-image zoom"
            />
          </div>

          {/* Línea divisoria */}
          <div className="divider"></div>

          {/* Información derecha */}
          <div className="product-info">
            <h1>{product.nombre_producto}</h1>
            <p className="product-description">{product.descripcion}</p>
            <p className="product-price">
              S/ {parseFloat(product.precio).toFixed(2)}
            </p>
            {product.discount && (
              <span className="discount-badge">Descuento activo</span>
            )}
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < product.rating ? "star filled" : "star"}
                >
                  ★
                </span>
              ))}
              <span className="rating-number">({product.rating})</span>
            </div>

            {/* Selector de cantidad */}
            <div className="quantity-selector">
              <label>Cantidad:</label>
              <div className="quantity-controls">
                <button onClick={decreaseQty} className="qty-btn">−</button>
                <span className="qty-value">{quantity}</span>
                <button onClick={increaseQty} className="qty-btn">+</button>
              </div>
            </div>

            <button
              className="btn btn-primary add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal login */}
      {showLoginAlert && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Inicia sesión</h2>
            <p>Debes iniciar sesión para agregar productos al carrito.</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowLoginAlert(false)}
              >
                Cancelar
              </button>
              <button className="btn-primary" onClick={() => navigate("/login")}>
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
