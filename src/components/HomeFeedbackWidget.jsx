// ✅ src/components/FeedbackWidget.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import "./FeedbackWidget.css";

export default function FeedbackWidget() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const q = query(
          collection(db, "feedback"),
          orderBy("createdAt", "desc"),
          limit(6) // show latest 6 reviews
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedbackList(data);
      } catch (error) {
        console.error("❌ Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="feedback-widget">
        <h3>💬 What Our Customers Say</h3>
        <p>Loading feedback...</p>
      </div>
    );
  }

  if (feedbackList.length === 0) {
    return (
      <div className="feedback-widget">
        <h3>💬 What Our Customers Say</h3>
        <p>No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="feedback-widget">
      <h3>
        💬 What Our Customers Say
        <span className="review-count">({feedbackList.length} Reviews)</span>
      </h3>

      <div className="feedback-list">
        {feedbackList.map((fb) => (
          <div key={fb.id} className="feedback-card">
            {/* 🗨️ Comment */}
            <p className="feedback-comment">
              {fb.comment && fb.comment.trim() !== ""
                ? fb.comment
                : "No comment provided."}
            </p>

            {/* ⭐ Rating + Service */}
            <p className="feedback-rating">
              ⭐ {fb.rating || 0}/5 —{" "}
              <b>{fb.serviceName || fb.service || "Service"}</b>
            </p>

            {/* 👤 Name + 📍 Place */}
            <p className="feedback-meta">
              👤 {fb.name || "Anonymous"} &nbsp; — &nbsp; 📍{" "}
              {fb.place || fb.city || "Unknown"}
            </p>

            {/* 🏷️ Tags */}
            {fb.tags && fb.tags.length > 0 && (
              <div className="feedback-tags">
                {fb.tags.map((tag, i) => (
                  <span key={i} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
