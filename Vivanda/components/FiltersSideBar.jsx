import React from "react";
import "../src/assets/CSS/filter.css";

export const FiltersSidebar = ({ filters, categories, onChange, onClose, open }) => {

  // Maneja el cambio del slider (solo enteros)
  const handleMinRatingChange = (e) => {
    const value = Math.round(Number(e.target.value)); // forzar entero
    const syntheticEvent = {
      target: {
        name: e.target.name,
        value: value
      }
    };
    onChange(syntheticEvent);
  };

  return (
    <aside className={`filters-sidebar ${open ? "open" : ""}`}>
      <h4>Filtros</h4>

      {/* Precio */}
      <div className="filter-item">
        <label>Precio</label>
        <div className="filter-range">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={onChange}
            placeholder="Min"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={onChange}
            placeholder="Max"
          />
        </div>
      </div>

      {/* Categoría */}
      <div className="filter-item">
        <label>Categoría</label>
        <select name="category" value={filters.category} onChange={onChange}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Calificación mínima */}
      <div className="filter-item">
        <label>Calificación mínima: {filters.minRating || 0}</label>
        <input
          type="range"
          name="minRating"
          min="0"
          max="5"
          step="1"
          value={filters.minRating || 0}
          onChange={handleMinRatingChange}
        />
      </div>

      {/* Descuento */}
      <div className="filter-item">
        <label>Descuento</label>
        <select name="discount" value={filters.discount} onChange={onChange}>
          <option value="">Todos</option>
          <option value="true">Con descuento</option>
          <option value="false">Sin descuento</option>
        </select>
      </div>

      <button className="filters-toggle-btn" onClick={onClose}>
        Cerrar Filtros
      </button>
    </aside>
  );
};
