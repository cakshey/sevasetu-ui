import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import thankImage from "../assets/thankyou.png"; // ✅ Your thank-you illustration
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
        // 🔹 1. Try LocalStorage first (fastest)
        const localBooking = localStorage.getItem("lastBooking");
        if (localBooking) {
          console.log("📦 Using localStorage booking");
          setBooking(JSON.parse(localBooking));
          setLoading(false);
          return;
        }

        // 🔹 2. Otherwise, fetch latest booking from Firestore
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = { id: doc.id, ...doc.data() };
          console.log("✅ Booking found in Firestore:", data);
          setBooking(data);
        } else {
          console.warn("⚠️ No userId match found, loading latest booking.");
          const fallback = query(
            collection(db, "bookings"),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const snap2 = await getDocs(fallback);
          if (!snap2.empty) {
            const doc = snap2.docs[0];
            const latest = { id: doc.id, ...doc.data() };
            setBooking(latest);
          } else {
            console.warn("⚠️ No booking found in Firestore at all.");
            setBooking(null);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching booking:", err);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="loading">Loading booking...</div>;

  if (!booking) {
    return (
      <div className="no-booking">
        <h3>No booking found!</h3>
        <button onClick={() => navigate("/services")}>Go to Services</button>
      </div>
    );
  }

  // ✅ Normalize both new & old booking formats
  let services = [];
  if (Array.isArray(booking.services)) {
    services = booking.services;
  } else if (booking.serviceName || booking.category) {
    services = [
      {
        category: booking.category || "Service",
        subService: booking.serviceName || booking.subService || "N/A",
        price: booking.price || 0,
        description: booking.description || "",
      },
    ];
  }

  const total = services.reduce((sum, s) => sum + (s.price || 0), 0);
  const address = booking.address || {};
  const bookingDate = booking.date || booking.dateOfService || "—";

  // ✅ Generate fallback Request ID
  const requestId =
    booking.requestId ||
    booking.id ||
    `REQ-${Math.floor(Math.random() * 90000) + 10000}`;

  // ✅ Smart address formatting
  const formattedAddress =
    address && (address.line1 || address.district || address.state)
      ? `${address.line1 || ""}${address.line1 ? ", " : ""}${
          address.district || ""
        }${address.district ? ", " : ""}${address.state || ""}${
          address.state ? " - " : ""
        }${address.pincode || ""}`
      : booking.addressText
      ? booking.addressText
      : "Not provided";

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">✅</div>

        {/* ✅ Inline Thank You Image */}
        <img src={thankImage} alt="Thank You" className="thank-image-inline" />

        <h2>Booking Confirmed!</h2>
        <p>
          Your booking with <strong>SevaSetu India</strong> is successfully
          recorded.
        </p>

        <div className="booking-summary">
          <h4>Service Summary</h4>
          <ul>
            {services.map((s, i) => (
              <li key={i}>
                {s.subService} — ₹{s.price}
              </li>
            ))}
          </ul>

          <p>
            <strong>Total:</strong> ₹{total}
          </p>
          <p>
            <strong>Date:</strong> {bookingDate}{" "}
            {booking.time && `at ${booking.time}`}
          </p>
          <p>
            <strong>Request ID:</strong> {requestId}
          </p>
          <p>
            <strong>Address:</strong>
            <br />
            {formattedAddress}
          </p>
        </div>

        <button onClick={() => navigate("/services")}>
          Book Another Service
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmation;
