// ✅ src/components/BookingConfirmation.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // 🔹 First, try Firestore
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          console.log("✅ Booking found in Firestore:", data);
          setBooking(data);
        } else {
          // 🔹 Fallback: check localStorage (recent booking)
          const localBooking = JSON.parse(localStorage.getItem("lastBooking"));
          if (localBooking) {
            console.log("📦 Using localStorage booking");
            setBooking(localBooking);
          } else {
            console.warn("⚠️ No booking found.");
            setBooking(null);
          }
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="loading">Loading booking...</div>;

  if (!booking)
    return (
      <div className="no-booking">
        <h3>No booking found!</h3>
        <button onClick={() => navigate("/services")}>Go to Services</button>
      </div>
    );

  const service = booking.services?.[0];
  const address = booking.address;

  return (
    <div className="confirmation-container">
      <div className="confirmation-left">
        <img src="/assets/thankyou.png" alt="Thank you" />
        <h3>🎉 Booking Confirmed!</h3>
        <p>Thank you for booking with <strong>SevaSetu India</strong>.</p>

        <div className="booking-summary">
          <p><strong>Service:</strong> {service?.subService || "—"}</p>
          <p><strong>Category:</strong> {service?.category || "—"}</p>
          <p><strong>Date of Service:</strong> {booking.date || "—"}</p>
          <p><strong>Request ID:</strong> {booking.requestId || "AUTO-GENERATED"}</p>
          <p><strong>Address:</strong>{" "}
            {address?.line1 ? `${address.line1}, ${address.district || ""}, ${address.state || ""}, ${address.pincode || ""}` : "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
