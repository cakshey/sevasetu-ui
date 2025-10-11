import React from "react";
import ReactDOM from "react-dom";
import "./toast.css";

export default function ToastContainer({ toasts, removeToast }) {
  return ReactDOM.createPortal(
    <div className="seva-toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`seva-toast ${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === "success" && "✅"}
              {toast.type === "warning" && "⚠️"}
              {toast.type === "error" && "❌"}
            </span>
            <div className="toast-message">
              <strong>{toast.title}</strong>
              <div>{toast.message}</div>
            </div>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>×</button>
        </div>
      ))}
    </div>,
    document.body
  );
}
