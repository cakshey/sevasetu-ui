// src/components/ServicesPage.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import "./ServicesPage.css";

function ServicesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [confirming, setConfirming] = useState(false);

  // 🔹 Fetch services from Firestore
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

  // 🔹 Book Now → open confirmation popup
  const handleBookNow = (service) => {
    setSelectedService(service);
    setConfirming(true);
  };

  // 🔹 Confirm Booking → save to Firestore + redirect
  const handleConfirmBooking = async () => {
    if (!selectedService) return;
    try {
      const booking = {
        serviceName: selectedService.name,
        category: selectedService.category,
        price: selectedService.price,
        description: selectedService.description,
        dateOfService: new Date().toLocaleDateString(),
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "bookings"), booking);

      console.log("✅ Booking saved:", docRef.id);

      // 🎯 Redirect to BookingConfirmation with details
      navigate("/booking-confirmation", {
        state: {
          id: docRef.id,
          service: selectedService.name,
          category: selectedService.category,
          date: booking.dateOfService,
        },
      });
    } catch (err) {
      console.error("❌ Error saving booking:", err);
      alert("Failed to save booking. Please try again.");
    } finally {
      setConfirming(false);
      setSelectedService(null);
    }
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
                onClick={() => handleBookNow(service)}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Confirmation Popup */}
      {confirming && selectedService && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Booking</h3>
            <p>
              Are you sure you want to book{" "}
              <strong>{selectedService.name}</strong> under{" "}
              <em>{selectedService.category}</em>?
            </p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleConfirmBooking}>
                Yes, Confirm
              </button>
              <button
                className="cancel-btn"
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesPage;
