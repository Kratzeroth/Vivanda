import React, { useState, useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { FiltersSidebar } from "./FiltersSideBar";
import "../src/assets/CSS/products.css";
import { useLocation, useNavigate } from "react-router-dom";

export const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    category: "Todas",
    minRating: 0,
    discount: ""
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [columns, setColumns] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsData, setProductsData] = useState([]);
  const [categories, setCategories] = useState(["Todas"]);
  const PRODUCTS_PER_PAGE = 12;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryQuery = params.get("category");
    if (categoryQuery) setFilters((prev) => ({ ...prev, category: categoryQuery }));
  }, [location.search]);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1200) setColumns(4);
      else if (window.innerWidth >= 992) setColumns(3);
      else if (window.innerWidth >= 768) setColumns(2);
      else setColumns(1);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  useEffect(() => {
    fetch("http://localhost/Vivanda/cliente/backend/prod_all.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const promoMap = {};
          data.promotions.forEach((p) => {
            promoMap[p.id_producto] = p.descuento_porcentaje;
          });

          const mapped = data.products.map((p) => {
            const discountPercent = promoMap[p.id_producto] || 0;
            const hasDiscount = discountPercent > 0;
            const discountedPrice = hasDiscount
              ? parseFloat(p.precio) * (1 - discountPercent / 100)
              : parseFloat(p.precio);

            return {
              id: p.id_producto,
              name: p.nombre_producto,
              price: discountedPrice,
              rating: p.calificacion ? parseInt(p.calificacion) : 0,
              category: p.categoria_nombre,
              discount: hasDiscount,
              discountPercent: discountPercent,
              image: p.imagen_url ? `/${p.imagen_url}` : "images/productos/default.png"
            };
          });

          setProductsData(mapped);
          setCategories(["Todas", ...new Set(mapped.map((p) => p.category))]);
        }
      })
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  const filteredProducts = productsData.filter((p) => {
    const matchPrice =
      (!filters.minPrice || p.price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || p.price <= parseFloat(filters.maxPrice));
    const matchCategory =
      filters.category === "Todas" || p.category === filters.category;
    const matchRating = !filters.minRating || p.rating >= parseInt(filters.minRating);

    let matchDiscount = true;
    if (filters.discount === "true") matchDiscount = p.discount === true;
    else if (filters.discount === "false") matchDiscount = p.discount === false;

    return matchPrice && matchCategory && matchRating && matchDiscount;
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageClick = (page) => setCurrentPage(page);
  const handleAddClick = (id) => navigate(`/product/${id}`);

  return (
    <div className="products-page">
      <Header />
      <div className="container-fluid">
        <button
          className="filters-toggle-btn"
          onClick={() => setSidebarOpen(true)}
        >
          Mostrar Filtros
        </button>

        <div className="products-main">
          <FiltersSidebar
            filters={filters}
            categories={categories}
            onChange={handleFilterChange}
            onClose={() => setSidebarOpen(false)}
            open={sidebarOpen}
          />

          <section className="products-list">
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {paginatedProducts.map((p) => (
                <div key={p.id} className="product-card">
                  {p.discount && (
                    <div className="discount-badge">-{Math.round(p.discountPercent)}%</div>
                  )}
                  <img src={p.image} alt={p.name} />
                  <h5 className="product-name">{p.name}</h5>

                  <div className="price-container">
                    <div className="price-row">
                      <span>Precio</span>
                      <span>S/ {p.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="btn-add" onClick={() => handleAddClick(p.id)}>
                    AGREGAR
                  </button>
                </div>
              ))}

              {paginatedProducts.length === 0 && (
                <p className="no-products">No se encontraron productos.</p>
              )}
            </div>

            <div className="pagination pagination-bottom">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => handlePageClick(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {sidebarOpen && (
        <div className="overlay show" onClick={() => setSidebarOpen(false)}></div>
      )}
      <Footer />
    </div>
  );
};
