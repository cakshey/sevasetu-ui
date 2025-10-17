import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import Lottie from "lottie-react";
import successAnim from "../assets/success.json";
import { db } from "../firebase";
import "./BookingForm.css";

const BookingForm = () => {
  const { service } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: service || "",
    date: "",
    timeSlot: "",
    pincode: "",
    city: "",
    state: "",
    address: "",
    notes: "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // 📍 Auto-fill City/State from pincode
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "pincode" && value.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data[0].Status === "Success") {
          const { District, State } = data[0].PostOffice[0];
          setFormData((prev) => ({ ...prev, city: District, state: State }));
        }
      } catch (err) {
        console.error("Pincode lookup failed:", err);
      }
    }
  };

  // 🌍 Locate Me button
  const handleLocate = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          const addr = data.address || {};
          setFormData((prev) => ({
            ...prev,
            pincode: addr.postcode || "",
            city: addr.city || addr.town || addr.village || "",
            state: addr.state || "",
          }));
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        setLoadingLocation(false);
      }
    );
  };

  // 📨 Submit Booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.date) < new Date(today)) {
      alert("Please select a valid future date.");
      return;
    }

    setSubmitting(true);

    try {
      // 🔹 Save to Firestore
      await addDoc(collection(db, "bookings"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      // 🔹 Log the active ENV IDs (for debug)
      console.log("📨 EmailJS ENV IDs:", {
        SERVICE_ID: process.env.REACT_APP_EMAILJS_SERVICE_ID,
        TEMPLATE_ID: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        ADMIN_TEMPLATE_ID: process.env.REACT_APP_EMAILJS_ADMIN_TEMPLATE_ID,
        PUBLIC_KEY: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
      });

      // 🔹 Send confirmation to Customer
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          user_name: formData.name,
          service_name: formData.service,
          booking_date: formData.date,
          time_slot: formData.timeSlot,
          address: formData.address,
          district: formData.city,
          state: formData.state,
          notes: formData.notes,
          reply_to: formData.email,
          phone: formData.phone,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      // 🔹 Send notification to Admin
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_ADMIN_TEMPLATE_ID,
        {
          user_name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service_name: formData.service,
          booking_date: formData.date,
          time_slot: formData.timeSlot,
          address: formData.address,
          district: formData.city,
          state: formData.state,
          notes: formData.notes,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      console.log("✅ Both Customer & Admin emails sent successfully!");
      setShowSuccess(true);
    } catch (err) {
      console.error("🔥 Booking submission failed:", err);
      alert("Booking failed, please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="success-container">
        <Lottie animationData={successAnim} loop={false} className="success-lottie" />
        <h3>🎉 Booking Successful!</h3>
        <p>You’ll receive confirmation via Email & SMS shortly.</p>
        <button className="back-home-btn" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
      </div>
    );
  }

  // 🧾 Booking Form UI
  return (
    <div className="booking-wrapper">
      <div className="booking-header">
        <h2>Book Trusted Home & Care Services</h2>
        <p className="subline">
          Fast, verified, and safe bookings — powered by{" "}
          <span className="brand">SevaSetu India</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

        <select name="service" value={formData.service} onChange={handleChange} required>
          <option value="">Select Service</option>
          <option>Plumbing</option>
          <option>Electrical</option>
          <option>Cleaning</option>
          <option>Carpentry</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={today}
          required
        />

        <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
          <option value="">Select Time Slot</option>
          <option>Morning (8 AM – 12 PM)</option>
          <option>Afternoon (12 PM – 4 PM)</option>
          <option>Evening (4 PM – 8 PM)</option>
        </select>

        <div className="pincode-row">
          <input
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
          <button
            type="button"
            className="locate-btn"
            onClick={handleLocate}
            disabled={loadingLocation}
          >
            {loadingLocation ? "Locating..." : "📍 Locate Me"}
          </button>
        </div>

        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
        <input name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} />
        <textarea
          name="notes"
          placeholder="Additional Notes (optional)"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>

        <button type="submit" disabled={submitting} className="confirm-btn">
          {submitting ? "Submitting..." : "Confirm Booking"}
        </button>
      </form>

      <div className="form-footer">
        <p>
          You’ll receive confirmation via Email & SMS.
          <br />
          Need help?{" "}
          <a href="mailto:support@sevasetu.in" className="support-link">
            Contact our support team.
          </a>
        </p>
        <button className="bottom-home-btn" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
