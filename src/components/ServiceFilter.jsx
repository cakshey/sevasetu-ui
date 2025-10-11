import React from "react";
import "./servicefilter.css";

export default function ServiceFilter({ categories = [], value, onChange }) {
  return (
    <div className="service-filter" role="tablist" aria-label="Service categories">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-btn ${value === cat ? "active" : ""}`}
          onClick={() => onChange(cat)}
          role="tab"
          aria-selected={value === cat}
        >
          {cat === "all" ? "All" : cat[0].toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
}
