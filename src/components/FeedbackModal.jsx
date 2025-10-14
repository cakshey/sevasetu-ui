// ✅ Feedback Modal - collects real ratings
import React, { useState } from "react";
import "./feedbackmodal.css";
import { FaStar } from "react-icons/fa";

const FeedbackModal = ({ onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
    } else {
      alert("Please select a rating before submitting.");
    }
  };

  return (
    <div className="feedback-modal-backdrop">
      <div className="feedback-modal">
        <h3>Rate Your Experience</h3>
        <p>How was your service experience with SevaSetu?</p>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((num) => (
            <FaStar
              key={num}
              size={30}
              color={num <= rating ? "#f4b400" : "#ccc"}
              onClick={() => setRating(num)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
        <div className="modal-buttons">
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
          <button className="close-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
