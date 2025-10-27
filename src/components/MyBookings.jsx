// ✅ src/components/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // 🧾 Fetch bookings
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const userBookings = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 💬 Fetch feedbacks
        const feedbackQuery = query(
          collection(db, "feedback"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const feedbackSnapshot = await getDocs(feedbackQuery);
        const userFeedbacks = feedbackSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBookings(userBookings);
        setFeedbacks(userFeedbacks);
      } catch (error) {
        console.error("Error fetching bookings/feedback:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="loading">Loading your bookings...</div>;

  if (bookings.length === 0)
    return (
      <div className="no-bookings">
        <h3>No bookings found 😕</h3>
        <p>Book a service to see it listed here.</p>
        <button onClick={() => navigate("/services")}>Browse Services</button>
      </div>
    );

  return (
    <div className="mybookings-container">
      <h2>📋 My Bookings</h2>

      <div className="bookings-list">
        {bookings.map((b) => {
          const serviceName = b.services?.[0]?.subService || "Service name unavailable";
          const category = b.services?.[0]?.category || "—";

          // ✅ Match feedback with service name OR category (more flexible)
          const relatedFeedback = feedbacks.find(
            (f) =>
              f.serviceName?.toLowerCase() === serviceName.toLowerCase() ||
              f.category?.toLowerCase() === category.toLowerCase()
          );

          return (
            <div key={b.id} className="booking-card">
              <div className="booking-info">
                <h3>{serviceName}</h3>
                <p><strong>Category:</strong> {category}</p>
                <p><strong>Date:</strong> {b.date || "—"}</p>
                <p><strong>Time:</strong> {b.timeSlot || "—"}</p>
                <p><strong>Status:</strong> {b.status || "Pending"}</p>
                <p><strong>Request ID:</strong> {b.requestId || b.id}</p>

                {b.address ? (
                  <p>
                    <strong>Address:</strong> {b.address.line1},{" "}
                    {b.address.district}, {b.address.state} - {b.address.pincode}
                  </p>
                ) : (
                  <p><strong>Address:</strong> Not provided</p>
                )}
              </div>

              {/* 💬 Feedback Section */}
              {relatedFeedback ? (
                <div className="feedback-section">
                  <h4>⭐ Your Feedback</h4>
                  <p><strong>Rating:</strong> {"★".repeat(relatedFeedback.rating)}</p>
                  <p><strong>Place:</strong> {relatedFeedback.place || "—"}</p>
                  <p><strong>Comment:</strong> {relatedFeedback.comment || "No comment provided."}</p>
                  <p className="feedback-date">
                    Submitted on:{" "}
                    {relatedFeedback.createdAt?.toDate
                      ? relatedFeedback.createdAt.toDate().toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              ) : (
                <p className="no-feedback">No feedback given yet.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
