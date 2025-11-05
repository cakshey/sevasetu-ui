import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import ThankYouImage from "../assets/thankyou.png";
import "./FeedbackForm.css";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [place, setPlace] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const feedbackTags = [
    "Service Quality",
    "Value for Money",
    "Friendly Staff",
    "Ease of Booking",
    "Overall Experience",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("lastBooking");
    if (stored) {
      try {
        const booking = JSON.parse(stored);
        const firstService =
          booking?.services && booking.services.length > 0 ? booking.services[0] : {};
        setCategory(firstService.category || "General");
        setService(firstService.subService || firstService.name || "Service");
        setPlace(booking?.address?.district || "");
        setName(booking?.name || auth.currentUser?.displayName || "");
        setEmail(booking?.email || auth.currentUser?.email || "");
      } catch (err) {
        console.error("⚠️ Could not parse booking data:", err);
      }
    }
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Block if not logged in
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in before submitting feedback.");
      return;
    }

    if (!rating) return alert("Please select a rating first.");

    setLoading(true);
    try {
      await addDoc(collection(db, "feedback"), {
        userId: user.uid,
        name: name || user.displayName || "Anonymous",
        email: email || user.email || "",
        category,
        serviceName: service,
        place: place || "Unknown",
        rating,
        comment: comment.trim() || "No comment provided",
        tags: selectedTags,
        createdAt: serverTimestamp(),
      });

      // ✅ Success animation
      setShowCheck(true);
      setTimeout(() => {
        setShowCheck(false);
        setSubmitted(true);
      }, 1200);
    } catch (error) {
      console.error("❌ Error saving feedback:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success Animation
  if (showCheck) {
    return (
      <div className="success-check-container">
        <div className="success-circle">
          <div className="success-checkmark"></div>
        </div>
        <p className="success-text">Feedback submitted successfully!</p>
      </div>
    );
  }

  // ✅ Thank You Screen
  if (submitted) {
    return (
      <div className="thankyou-card">
        <img src={ThankYouImage} alt="Thank You" className="thankyou-img" />
        <h2>Thank you for your feedback!</h2>
        <p>
          We truly appreciate your trust in <strong>SevaSetu India</strong>.
        </p>

        <div className="thankyou-buttons">
          <button onClick={() => (window.location.href = "/services")}>
            🌐 Explore More Services
          </button>
          <button onClick={() => (window.location.href = "/")}>
            🏠 Go to Home
          </button>
        </div>
      </div>
    );
  }

  // ✅ Rating labels
  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="feedback-form-wrapper">
      <h3>⭐ Rate Your Experience</h3>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-grid">
          <div>
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Category</label>
            <input type="text" value={category} readOnly className="readonly-input" />
          </div>
          <div>
            <label>Service</label>
            <input type="text" value={service} readOnly className="readonly-input" />
          </div>
          <div>
            <label>Place / District</label>
            <input
              type="text"
              placeholder="Enter your city or district"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>
          <div>
            <label>Rating</label>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`star ${star <= rating ? "active" : ""}`}
                >
                  ★
                </span>
              ))}
              {rating > 0 && (
                <span className="rating-label">
                  {`${rating}/5 ${ratingLabels[rating - 1]}`}
                </span>
              )}
            </div>
          </div>
        </div>

        <label>What did you like most?</label>
        <div className="tag-buttons">
          {feedbackTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={selectedTags.includes(tag) ? "selected" : ""}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <label>Comments</label>
        <textarea
          placeholder="Share your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
