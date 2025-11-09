import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-header">
            <span>Service</span>
            <span>Category</span>
            <span>Price (₹)</span>
            <span>Remove</span>
          </div>

          <div className="cart-items">
            {cart.map((item, index) => (
              <div className="cart-row" key={index}>
                <span className="cart-service">{item.name}</span>
                <span className="cart-category">{item.category}</span>
                <span className="cart-price">₹{item.price || 0}</span>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.name)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h3>Total: ₹{total}</h3>
          </div>

          <div className="cart-buttons">
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
