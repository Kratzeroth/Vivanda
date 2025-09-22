import React, { useState, useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { FiltersSidebar } from "./FiltersSideBar";
import "../src/assets/CSS/products.css";

export const ProductsPage = () => {
    const [filters, setFilters] = useState({
        minPrice: "", maxPrice: "", category: "TODO", brand: "", minRating: "", discount: ""
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [columns, setColumns] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

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
    };

    const filteredProducts = productsData.filter(p => (
        (!filters.minPrice || p.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || p.price <= parseFloat(filters.maxPrice)) &&
        (filters.category === "TODO" || p.category === filters.category) &&
        (!filters.brand || p.brand === filters.brand) &&
        (!filters.minRating || p.rating >= parseFloat(filters.minRating)) &&
        (!filters.discount || (filters.discount === "true" ? p.discount : !p.discount))
    ));

    const totalPages = 5; // solo visual
    const handlePageClick = (page) => setCurrentPage(page);

    return (
        <div className="products-page">
            <Header />
            <div className="container-fluid">
                <button className="filters-toggle-btn" onClick={() => setSidebarOpen(true)}>Mostrar Filtros</button>

                <div className="products-main">
                    <FiltersSidebar
                        filters={filters}
                        onChange={handleFilterChange}
                        onClose={() => setSidebarOpen(false)}
                        open={sidebarOpen}
                    />

                    <section className="products-list">
                        {/* Paginación arriba derecha */}
                        <div className="pagination pagination-top">
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

                        <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                            {filteredProducts.map(p => (
                                <div key={p.id} className="product-card">
                                    <img src={p.image} alt={p.name} />
                                    <h5>{p.name}</h5>
                                    <p>Precio: S/ {p.price.toFixed(2)}</p>
                                    <p>Calificación: {p.rating} ⭐</p>
                                    <button className="btn">Comprar</button>
                                </div>
                            ))}
                        </div>

                        {/* Paginación abajo centrada */}
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
            {sidebarOpen && <div className="overlay show" onClick={() => setSidebarOpen(false)}></div>}
            <Footer />
        </div>
    );
};

// ====== CATEGORÍAS DINÁMICAS ======
export const categories = ["TODO", "Frutas", "Lácteos", "Panadería", "Bebidas", "Cereales", "Snacks"];

// Simulación de datos
const productsData = [
  { id: 1, name: "Fruta 1", price: 5, rating: 4.5, category: "Frutas", brand: "FreshFarm", discount: true, image: "../src/assets/categorias/frutas.png" },
  { id: 2, name: "Leche 1", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
  { id: 3, name: "Pan 1", price: 4, rating: 4.2, category: "Panadería", brand: "PanDulce", discount: true, image: "../src/assets/categorias/frutas.png" },
  { id: 4, name: "Queso 1", price: 10, rating: 4.7, category: "Lácteos", brand: "CheeseCo", discount: true, image: "../src/assets/categorias/frutas.png" },
  { id: 5, name: "Jugo 1", price: 6, rating: 4.3, category: "Bebidas", brand: "JuiceCo", discount: false, image: "../src/assets/categorias/frutas.png" },
  { id: 6, name: "Cereal 1", price: 7, rating: 4.6, category: "Cereales", brand: "CerealCo", discount: false, image: "../src/assets/categorias/frutas.png" },
  { id: 7, name: "Snack 1", price: 3, rating: 3.9, category: "Snacks", brand: "SnackCo", discount: true, image: "../src/assets/categorias/frutas.png" },
  { id: 8, name: "Fruta 2", price: 9, rating: 4.1, category: "Frutas", brand: "FreshFarm", discount: false, image: "../src/assets/categorias/frutas.png" },
  { id: 10, name: "Snack 2", price: 11, rating: 4.0, category: "Snacks", brand: "SnackCo", discount: false, image: "../src/assets/categorias/frutas.png" }
];
