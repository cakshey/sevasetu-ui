import React from "react";
import "./bottomnav.css";

export default function BottomNav({ items = [] }) {
  return (
    <nav className="bottom-nav">
      {items.map((item, i) => (
        <button
          key={i}
          className={`bottom-nav__item ${
            item.active ? "bottom-nav__item--active" : ""
          }`}
          onClick={item.onClick}
        >
          {item.icon && <span className="bottom-nav__icon">{item.icon}</span>}
          <span className="bottom-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
