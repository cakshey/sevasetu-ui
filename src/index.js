// ✅ src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// 🔧 Disable StrictMode to stop double rendering in dev
root.render(
  <CartProvider>
    <App />
  </CartProvider>
);
