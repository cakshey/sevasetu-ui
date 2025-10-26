// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

// Create Context
const CartContext = createContext();

// Custom hook
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add a service
  const addToCart = (service) => {
    setCart((prev) => [...prev, service]);
  };

  // Remove service
  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all services
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
