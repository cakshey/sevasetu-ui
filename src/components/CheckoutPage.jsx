// ✅ src/components/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) navigate("/"); // redirect if not logged in
  }, [user, navigate]);

  const fetchAddress = async (pin) => {
    if (pin.length !== 6) return;
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
    }
  };

  const handleBooking = async () => {
    if (!phone.match(/^\d{10}$/)) return alert("Enter valid 10-digit phone");
    if (!pincode || !address || !date || !time) return alert("All fields required");

    setLoading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        name: user.displayName,
        email: user.email,
        phone,
        services: cart,
        address: { line1: address, district, state, pincode },
        date,
        time,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("✅ Booking confirmed!");
      clearCart();
      navigate("/");
    } catch (e) {
      console.error("Error adding booking:", e);
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <p>Logged in as: <strong>{user?.displayName}</strong> ({user?.email})</p>

      <h3>Selected Services</h3>
      <ul>
        {cart.map((s, i) => (
          <li key={i}>
            {s.subService} – ₹{s.price}
          </li>
        ))}
      </ul>

      <div className="checkout-form">
        <input
          type="text"
          placeholder="10-digit Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value);
            fetchAddress(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="District"
          value={district}
          readOnly
        />
        <input
          type="text"
          placeholder="State"
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
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button disabled={loading} onClick={handleBooking}>
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
