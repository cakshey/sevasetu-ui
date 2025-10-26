// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext"; // ✅ Import context provider
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* ✅ Wrap the entire app inside CartProvider */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
