import React from "react";
import ReactDOM from "react-dom";
import "./modal.css";

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="seva-modal-overlay" onClick={onClose}>
      <div
        className="seva-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="seva-modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <section className="seva-modal-body">{children}</section>

        {footer && <footer className="seva-modal-footer">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}
