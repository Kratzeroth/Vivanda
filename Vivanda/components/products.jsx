import React, { useState, useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import "../src/assets/CSS/products.css";

export const ProductsPage = () => {
    const [filters, setFilters] = useState({
        minPrice: "", maxPrice: "", category: "", brand: "", minRating: "", discount: ""
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [columns, setColumns] = useState(4);
    const rowsPerPage = 10;

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

    const filteredProducts = productsData.filter(p => (
        (!filters.minPrice || p.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || p.price <= parseFloat(filters.maxPrice)) &&
        (!filters.category || p.category === filters.category) &&
        (!filters.brand || p.brand === filters.brand) &&
        (!filters.minRating || p.rating >= parseFloat(filters.minRating)) &&
        (!filters.discount || (filters.discount === "true" ? p.discount : !p.discount))
    ));

    const productsPerPage = rowsPerPage * columns;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    let currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    if (currentProducts.length < productsPerPage) {
        const fillers = Array.from(
            { length: productsPerPage - currentProducts.length },
            (_, i) => ({ id: "empty-" + i, name: "", price: 0, rating: 0, image: "", filler: true })
        );
        currentProducts = [...currentProducts, ...fillers];
    }

    // Función para generar paginación con "..."
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // botones visibles al centro
        const half = Math.floor(maxVisible / 2);

        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, currentPage + half);

        if (start === 1) {
            end = Math.min(totalPages, maxVisible);
        }
        if (end === totalPages) {
            start = Math.max(1, totalPages - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const renderPagination = () => {
        const pageNumbers = getPageNumbers();
        return (
            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Anterior</button>

                {pageNumbers[0] > 1 && (
                    <>
                        <button onClick={() => setCurrentPage(1)}>1</button>
                        {pageNumbers[0] > 2 && <span className="dots">...</span>}
                    </>
                )}

                {pageNumbers.map(num => (
                    <button
                        key={num}
                        className={num === currentPage ? "active" : ""}
                        onClick={() => setCurrentPage(num)}
                    >
                        {num}
                    </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="dots">...</span>}
                        <button onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                    </>
                )}

                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Siguiente</button>
            </div>
        );
    };

    return (
        <div className="products-page">
            <Header />
            <div className="container-fluid">
                <button className="filters-toggle-btn" onClick={() => setSidebarOpen(true)}>Mostrar Filtros</button>

                <div className="products-main">
                    <aside className={`filters-sidebar ${sidebarOpen ? "open" : ""}`}>
                        <h4>Filtros</h4>
                        <div className="filter-item">
                            <label>Precio</label>
                            <div className="filter-range">
                                <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min" />
                                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max" />
                            </div>
                        </div>
                        <div className="filter-item">
                            <label>Categoría</label>
                            <select name="category" value={filters.category} onChange={handleFilterChange}>
                                <option value="">Todas</option>
                                <option value="Frutas">Frutas</option>
                                <option value="Lácteos">Lácteos</option>
                                <option value="Panadería">Panadería</option>
                                <option value="Bebidas">Bebidas</option>
                                <option value="Cereales">Cereales</option>
                                <option value="Snacks">Snacks</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>Marca</label>
                            <select name="brand" value={filters.brand} onChange={handleFilterChange}>
                                <option value="">Todas</option>
                                <option value="FreshFarm">FreshFarm</option>
                                <option value="LaVaquita">LaVaquita</option>
                                <option value="PanDulce">PanDulce</option>
                                <option value="CheeseCo">CheeseCo</option>
                                <option value="JuiceCo">JuiceCo</option>
                                <option value="CerealCo">CerealCo</option>
                                <option value="SnackCo">SnackCo</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>Calificación mínima</label>
                            <input type="number" name="minRating" value={filters.minRating} onChange={handleFilterChange} placeholder="0-5" step="0.1" min="0" max="5" />
                        </div>
                        <div className="filter-item">
                            <label>Descuento</label>
                            <select name="discount" value={filters.discount} onChange={handleFilterChange}>
                                <option value="">Todos</option>
                                <option value="true">Con descuento</option>
                                <option value="false">Sin descuento</option>
                            </select>
                        </div>
                        <button className="filters-toggle-btn" onClick={() => setSidebarOpen(false)}>Cerrar Filtros</button>
                    </aside>

                    <section className="products-list">
                        {renderPagination()}

                        <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                            {currentProducts.map(p => (
                                <div key={p.id} className={`product-card ${p.filler ? "empty" : ""}`}>
                                    {!p.filler && (
                                        <>
                                            <img src={p.image} alt={p.name} />
                                            <h5>{p.name}</h5>
                                            <p>Precio: S/ {p.price.toFixed(2)}</p>
                                            <p>Calificación: {p.rating} ⭐</p>
                                            <button className="btn">Comprar</button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {renderPagination()}
                    </section>
                </div>
            </div>
            {sidebarOpen && <div className="overlay show" onClick={() => setSidebarOpen(false)}></div>}
            <Footer />
        </div>
    );
};

const productsData = [
    { id: 1, name: "Producto 1", price: 5, rating: 4.5, category: "Frutas", brand: "FreshFarm", discount: true, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 2, name: "Producto 2", price: 8, rating: 4.0, category: "Lácteos", brand: "LaVaquita", discount: false, image: "../src/assets/categorias/frutas.png" },
    { id: 60, name: "Producto 60", price: 4, rating: 3.5, category: "Snacks", brand: "SnackCo", discount: false, image: "../src/assets/categorias/frutas.png" }
];

