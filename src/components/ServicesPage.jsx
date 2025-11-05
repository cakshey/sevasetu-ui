// ✅ src/components/ServicesPage.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocsFromServer,
} from "firebase/firestore";
import { db } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ServicesPage.css";

function ServicesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  const { cart, addToCart } = useCart();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Prevent double fetch in React Strict Mode
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      // ✅ Prevent double-fetch during dev (React 18 StrictMode)
      if (hasFetched) return;
      setHasFetched(true);

      try {
        setLoading(true);

        const rawCategory = decodeURIComponent(category || "").trim();

        // Always pull from Firestore server
        const snap = await getDocsFromServer(collection(db, "services"));
        let data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (rawCategory) {
          const normalizedCategory = rawCategory
            .replace(/%26/g, "&")
            .replace(/&{2,}/g, "&")
            .replace(/’|‘/g, "'")
            .replace(/\u00A0/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

          data = data.filter(
            (s) =>
              s.category &&
              s.category
                .toString()
                .trim()
                .replace(/\s+/g, " ")
                .toLowerCase() === normalizedCategory
          );
        }

        // ✅ Remove duplicates client-side (just in case)
        const uniqueServices = data.filter(
          (v, i, a) =>
            a.findIndex(
              (t) =>
                t.name?.trim().toLowerCase() === v.name?.trim().toLowerCase() &&
                t.category?.trim().toLowerCase() === v.category?.trim().toLowerCase()
            ) === i
        );

        // Replace, don’t append
        setServices(() => uniqueServices.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error("❌ Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [category, hasFetched]);

  // 🛒 Add to cart
  const handleAddToCart = (service) => {
    addToCart(service);
    alert(`${service.name || service.subService} added to your cart.`);
  };

  // 🧭 Go to checkout
  const goToCheckout = () => navigate("/checkout");

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
                  <h3>{service.name || service.subService}</h3>
                  {service.price && (
                    <span className="service-price">₹{service.price}</span>
                  )}
                </div>

                <p className="service-description">
                  {service.description?.trim()
                    ? service.description
                    : service.remarks?.trim()
                    ? service.remarks
                    : "No description available."}
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

          {/* ✅ Floating checkout bar when items in cart */}
          {cart.length > 0 && (
            <div className="floating-checkout">
              <p>
                🛒 You have {cart.length} service
                {cart.length > 1 ? "s" : ""} in your cart.
              </p>
              <button onClick={goToCheckout} className="checkout-btn">
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
