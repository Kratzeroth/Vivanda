import React from "react";
import "../src/assets/CSS/filter.css";
export const FiltersSidebar = ({ filters, onChange, onClose, open }) => {
  return (
    <aside className={`filters-sidebar ${open ? "open" : ""}`}>
      <h4>Filtros</h4>
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

      <div className="filter-item">
        <label>Categoría</label>
        <select name="category" value={filters.category} onChange={onChange}>
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
        <select name="brand" value={filters.brand} onChange={onChange}>
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
        <input
          type="number"
          name="minRating"
          value={filters.minRating}
          onChange={onChange}
          placeholder="0-5"
          step="0.1"
          min="0"
          max="5"
        />
      </div>

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
