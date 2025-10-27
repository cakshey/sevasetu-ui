import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
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

  // Predefined feedback tags
  const feedbackTags = [
    "Service Quality",
    "Value for Money",
    "Friendly Staff",
    "Ease of Booking",
    "Overall Experience",
  ];

  // ✅ Load booking info
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

  // Tag toggle
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return alert("Please select a rating first.");

    setLoading(true);
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "feedback"), {
        userId: user?.uid || "guest",
        name: name || "Anonymous",
        email: email || "",
        category,
        serviceName: service,
        place: place || "Unknown",
        rating,
        comment: comment.trim() || "No comment provided",
        tags: selectedTags,
        createdAt: serverTimestamp(),
      });

      alert("✅ Thank you for your feedback!");
      setRating(0);
      setComment("");
      setSelectedTags([]);
    } catch (error) {
      console.error("❌ Error saving feedback:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="feedback-form-container">
      <h3>⭐ Rate Your Experience</h3>
      <form onSubmit={handleSubmit}>
        <label>Your Name</label>
        <input
          type="text"
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Category</label>
        <input type="text" value={category} readOnly className="readonly-input" />

        <label>Service</label>
        <input type="text" value={service} readOnly className="readonly-input" />

        <label>Place / District</label>
        <input
          type="text"
          placeholder="Enter your city or district"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />

        {/* ⭐ RATING */}
        <label>Rating</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={star <= rating ? "active" : ""}
            >
              ★
            </span>
          ))}
          {rating > 0 && (
            <span className="rating-label">{`${rating}/5 ${ratingLabels[rating - 1]}`}</span>
          )}
        </div>

        {/* 🏷️ TAGS SECTION */}
        <label>What did you like most?</label>
        <div className="tags-container">
          {feedbackTags.map((tag) => (
            <div
              key={tag}
              className={`tag ${selectedTags.includes(tag) ? "selected" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>

        <label>Comments</label>
        <textarea
          placeholder="Share your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
