import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import "./ServicesPage.css";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Extract ?category= parameter if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    setCategoryName(cat || "");
  }, [location.search]);

  // 🔹 Fetch services from Firestore
  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const ref = collection(db, "services");
        const q = categoryName
          ? query(ref, where("category", "==", categoryName))
          : ref;

        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Remove duplicates by name
        const unique = [];
        const seen = new Set();
        for (const s of data) {
          if (!seen.has(s.name)) {
            seen.add(s.name);
            unique.push(s);
          }
        }

        setServices(unique);
      } catch (err) {
        console.error("❌ Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [categoryName]);

  // 🔹 Add item to cart (store with proper price field)
  const handleAddToCart = (service) => {
    const existing = JSON.parse(localStorage.getItem("cart") || "[]");

    const priceValue =
      Number(service.price) ||
      Number(service.sellPrice) ||
      Number(service.servicePrice) ||
      Number(service.providerCost) ||
      0;

    existing.push({
      id: service.id,
      name: service.name,
      category: service.category,
      price: priceValue,
    });

    localStorage.setItem("cart", JSON.stringify(existing));
    alert(`${service.name} added to cart!`);
  };

  const goToCart = () => navigate("/cart");

  if (loading)
    return (
      <div className="services-page-container">
        <p className="loading-text">Loading services...</p>
      </div>
    );

  return (
    <div className="services-page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="page-title">
        {categoryName ? `${categoryName} Services` : "All Services"}
      </h2>

      {services.length === 0 ? (
        <p className="no-services">No services found in this category.</p>
      ) : (
        <div className="services-grid">
          {services.map((s) => {
            const priceValue =
              s.price ||
              s.sellPrice ||
              s.servicePrice ||
              s.providerCost ||
              0;

            return (
              <div className="service-card" key={s.id}>
                <div className="service-header">
                  <h3 className="service-name">{s.name}</h3>
                  <p className="service-price">₹{priceValue}</p>
                </div>
                <p className="service-category">{s.category}</p>
                <p className="service-description">
                  {s.description || "No description available."}
                </p>
                <button
                  className="add-btn"
                  onClick={() => handleAddToCart(s)}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      )}

      {services.length > 0 && (
        <div className="checkout-section">
          <p className="cart-summary">
            You have{" "}
            {JSON.parse(localStorage.getItem("cart") || "[]").length} item(s) in
            your cart.
          </p>
          <button className="go-cart-btn" onClick={goToCart}>
            Go to Your Cart →
          </button>
        </div>
      )}
    </div>
  );
}
