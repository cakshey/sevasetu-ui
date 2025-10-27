// src/components/BookingConfirmation.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackForm from "./FeedbackForm";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const storedBooking = localStorage.getItem("lastBooking");
    if (storedBooking) {
      try {
        setBookingData(JSON.parse(storedBooking));
      } catch {
        console.error("Failed to parse booking data");
      }
    }
  }, []);

  if (!bookingData) {
    return (
      <div className="confirmation-container">
        <h2>Booking Not Found</h2>
        <p>Your booking details could not be loaded.</p>
        <button onClick={() => navigate("/")}>← Back to Home</button>
      </div>
    );
  }

  const firstService = bookingData.services?.[0] || {};
  const category = firstService.category || "General";
  const serviceName =
    firstService.subService || firstService.name || "Service";

  return (
    <div className="confirmation-container">
      <h2>✅ Thank you for your booking!</h2>
      <p>
        We truly appreciate your trust in <strong>SevaSetu India</strong>.
      </p>
      <p>Please take a moment to rate your experience below 👇</p>

      <div className="feedback-section">
        <FeedbackForm
          userName={bookingData.name}
          userEmail={bookingData.email}
          category={category}
          serviceName={serviceName}
          place={bookingData.address?.district || ""}
        />
      </div>

      <button
        className="back-home-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default BookingConfirmation;
