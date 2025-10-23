// src/components/BookingConfirmation.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "./BookingConfirmation.css";
import thankYouImg from "../assets/thankyou-illustration.png"; // ✅ image in src/assets

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {}; // passed from ServicesPage on booking

  // ✅ States
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState(""); // 👈 added
  const [userLocation, setUserLocation] = useState(""); // 👈 renamed from 'location' to avoid conflict with useLocation()
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const tags = [
    "Ease of Booking",
    "Service Quality",
    "Value for Money",
    "Friendly Staff",
    "Overall Experience",
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ✅ Submit feedback to Firestore
  const handleSubmit = async () => {
    if (!rating) {
      alert("Please provide a rating before submitting.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "feedback"), {
        rating,
        tags: selectedTags,
        comment,
        userName: userName || "Anonymous",
        location: userLocation || "—",
        serviceName: bookingData.service || "N/A",
        category: bookingData.category || "N/A",
        createdAt: serverTimestamp(),
      });

      console.log("✅ Feedback saved successfully!");
      setSubmitted(true);
    } catch (err) {
      console.error("❌ Error saving feedback:", err);
      alert("Something went wrong while saving feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        {/* LEFT SIDE */}
        <div className="confirmation-left">
          <img
            src={thankYouImg}
            alt="Booking Confirmed"
            className="confirmation-image"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="confirmation-right">
          <h2>🎉 Booking Confirmed!</h2>
          <p className="confirmation-text">
            Thank you for booking with <strong>SevaSetu India</strong>!
          </p>

          <div className="booking-details">
            <p>
              <strong>Service:</strong> {bookingData.service || "N/A"}
            </p>
            <p>
              <strong>Category:</strong> {bookingData.category || "N/A"}
            </p>
            <p>
              <strong>Date of Service:</strong>{" "}
              {bookingData.date || new Date().toLocaleDateString()}
            </p>
            <p>
              <strong>Request ID:</strong> {bookingData.id || "Not Available"}
            </p>
          </div>

          <hr />

          {/* ⭐ Feedback Section */}
          <div className="feedback-section">
            <h3>⭐ Rate Your Experience</h3>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="tags">
              {tags.map((tag, index) => (
                <button
                  key={index}
                  className={`tag-btn ${
                    selectedTags.includes(tag) ? "selected" : ""
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* 🧑 User Info Fields */}
            <input
              type="text"
              placeholder="Your Name"
              className="feedback-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your City / Area"
              className="feedback-input"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
            />

            <textarea
              className="feedback-comment"
              placeholder="Share any comments (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            {!submitted ? (
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            ) : (
              <p className="thank-you-msg">
                ✅ Thanks for sharing your feedback!
              </p>
            )}
          </div>

          {/* 🔘 Action Buttons */}
          <div className="action-buttons">
            <button className="home-btn" onClick={() => navigate("/")}>
              🏠 Go to Homepage
            </button>
            <button
              className="view-btn"
              onClick={() => navigate("/services", { replace: true })}
            >
              📋 View My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
