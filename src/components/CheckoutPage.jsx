// ✅ src/components/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import FeedbackForm from "./FeedbackForm";
import "./CheckoutPage.css";

function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const navigate = useNavigate();
  const user = auth.currentUser;

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch address details from pincode (debounced)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (pincode.length === 6) fetchAddress(pincode);
    }, 600);
    return () => clearTimeout(delay);
  }, [pincode]);

  const fetchAddress = async (pin) => {
    if (pin.length !== 6) return;
    setAddressLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const office = data[0].PostOffice[0];
        setDistrict(office.District);
        setState(office.State);
      } else {
        setDistrict("");
        setState("");
      }
    } catch (err) {
      console.error("Pincode lookup failed:", err);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleBooking = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!phone.match(/^\d{10}$/)) return alert("Enter a valid 10-digit phone number");
    if (!pincode || !address || !date || !timeSlot)
      return alert("All fields are required");

    setLoading(true);

    try {
      const newBooking = {
        userId: user?.uid || "unknown_user",
        name: user?.displayName || "Customer",
        email: user?.email || "",
        phone: phone || "",
        services: cart.map((item) => ({
          category: item.category || "General",
          subService: item.subService || item.name || "Unnamed Service",
          price: item.price ?? 0,
        })),
        address: {
          line1: address || "",
          district: district || "",
          state: state || "",
          pincode: pincode || "",
        },
        date: date || "",
        timeSlot: timeSlot || "",
        status: "pending",
        requestId: `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: serverTimestamp(),
      };

      const cleanData = (obj) => {
        if (Array.isArray(obj)) return obj.map(cleanData);
        if (obj && typeof obj === "object") {
          return Object.fromEntries(
            Object.entries(obj)
              .filter(([_, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, cleanData(v)])
          );
        }
        return obj;
      };

      const safeBooking = cleanData(newBooking);
      await addDoc(collection(db, "bookings"), safeBooking);

      localStorage.setItem(
        "lastBooking",
        JSON.stringify({
          ...safeBooking,
          createdAt: new Date().toISOString(),
        })
      );

      clearCart();
      setBookingSuccess(true);
    } catch (error) {
      console.error("🔥 Error adding booking:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, s) => sum + (s.price || 0), 0);

  const locateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAddressLoading(true);
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            const addr = data.address || {};
            setPincode(addr.postcode || "");
            setDistrict(addr.city_district || addr.county || addr.city || "");
            setState(addr.state || "");
            setAddress(
              `${addr.road || ""} ${addr.suburb || ""} ${addr.village || ""}`.trim()
            );
          })
          .catch(() => alert("Could not fetch address"))
          .finally(() => setAddressLoading(false));
      },
      () => alert("Location permission denied")
    );
  };

  // ✅ After booking success → Show thank you + feedback form
  if (bookingSuccess) {
    const lastService = cart[0]?.subService || cart[0]?.name || "Service";
    return (
      <div className="checkout-success">
        <h2>✅ Thank you for your booking!</h2>
        <p>
          We truly appreciate your trust in <strong>SevaSetu India</strong>.
        </p>
        <p>Please take a moment to rate your experience below 👇</p>

        <FeedbackForm
          serviceName={lastService}
          category={cart[0]?.category || "General"}
          userName={user?.displayName || ""}
          userEmail={user?.email || ""}
          place={district || ""}
        />

        <button className="home-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    );
  }

  // ✅ Default Checkout Form
  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <p>
        Logged in as: <strong>{user?.displayName}</strong> ({user?.email})
      </p>

      <h3>Selected Services</h3>
      <ul>
        {cart.map((s, i) => (
          <li key={i}>
            {s.subService || s.name} – ₹{s.price}
          </li>
        ))}
      </ul>
      <h4>Total: ₹{total}</h4>

      <div className="checkout-form">
        <input
          type="text"
          placeholder="10-digit Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="pincode-row">
          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <button type="button" className="locate-btn" onClick={locateMe}>
            📍 Locate Me
          </button>
        </div>

        <input
          type="text"
          placeholder={addressLoading ? "Fetching district..." : "District"}
          value={district}
          readOnly
        />
        <input
          type="text"
          placeholder={addressLoading ? "Fetching state..." : "State"}
          value={state}
          readOnly
        />
        <textarea
          placeholder="Full address / landmark"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* ✅ Time Slot Dropdown */}
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
          <option value="">Select Time Slot</option>
          <option value="9 AM - 12 PM">9 AM - 12 PM</option>
          <option value="12 PM - 3 PM">12 PM - 3 PM</option>
          <option value="3 PM - 6 PM">3 PM - 6 PM</option>
        </select>

        <button disabled={loading} onClick={handleBooking}>
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
