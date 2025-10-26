// src/components/ServicesPage.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // ✅ import cart context
import "./ServicesPage.css";

function ServicesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  const { cart, addToCart } = useCart(); // ✅ now using cart too
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch services
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        let q;

        if (category) {
          const normalizedCategory = decodeURIComponent(category)
            .replace(/’/g, "'")
            .replace(/‘/g, "'")
            .replace(/\u00A0/g, " ")
            .trim();

          console.log("📂 Selected category:", normalizedCategory);

          q = query(
            collection(db, "services"),
            where("category", "==", normalizedCategory)
          );
        } else {
          console.log("📂 Loading all services");
          q = collection(db, "services");
        }

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("✅ Loaded services:", data);
        setServices(data);
      } catch (err) {
        console.error("❌ Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [category]);

  // 🔹 Add service to cart
  const handleAddToCart = (service) => {
    addToCart(service);
    alert(`${service.name} added to your cart.`);
  };

  // 🔹 Go to checkout
  const goToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="services-page-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <h2 className="page-title">
        {category
          ? `${decodeURIComponent(category).replace(/’/g, "'")} Services`
          : "All Available Services"}
      </h2>

      {loading ? (
        <p className="loading-text">⏳ Loading services...</p>
      ) : services.length === 0 ? (
        <p className="no-data">⚠️ No services found for this category.</p>
      ) : (
        <>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-header">
                  <h3>{service.name}</h3>
                  <span className="service-price">₹{service.price}</span>
                </div>
                <p className="service-description">
                  {service.description || "No description available."}
                </p>
                <button
                  className="book-now"
                  onClick={() => handleAddToCart(service)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* ✅ Checkout button visible only if cart has items */}
          {cart.length > 0 && (
            <div className="checkout-section">
              <p className="cart-summary">
                🛒 You have {cart.length} service{cart.length > 1 ? "s" : ""} in your cart.
              </p>
              <button className="go-checkout-btn" onClick={goToCheckout}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ServicesPage;
