import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FloatingCart.css";

export default function FloatingCart() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  if (cartCount === 0) return null; // hide when empty

  return (
    <div className="floating-cart" onClick={() => navigate("/cart")}>
      🛒 <span className="cart-count">{cartCount}</span>
    </div>
  );
}
