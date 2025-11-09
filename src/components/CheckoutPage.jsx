// ✅ src/components/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FeedbackForm from "./FeedbackForm";
import "./CheckoutPage.css";

function CheckoutPage() {
  const [cart, setCart] = useState([]);
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

  // ✅ Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // ✅ Fetch address from pincode
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

  // ✅ Assign provider (unchanged)
  const assignProvider = async (category, userDistrict) => {
    try {
      const q = query(
        collection(db, "service_providers"),
        where("category", "==", category),
        where("district", "==", userDistrict),
        where("verified", "==", true),
        where("available", "==", true)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        toast.warn(`⚠️ No provider available in ${userDistrict}`);
        return null;
      }

      const providers = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));

      const selected = providers[0];

      await updateDoc(doc(db, "service_providers", selected.id), {
        available: false,
      });

      toast.success(`✅ Assigned: ${selected.name} (${selected.category})`);
      return selected;
    } catch (error) {
      console.error("❌ Error assigning provider:", error);
      toast.error("Error assigning provider");
      return null;
    }
  };

  // ✅ Handle booking
  const handleBooking = async () => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (currentCart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!phone.match(/^\d{10}$/)) return alert("Enter a valid 10-digit phone number");
    if (!pincode || !address || !date || !timeSlot)
      return alert("All fields are required");

    setLoading(true);

    try {
      const serviceCategory = currentCart[0]?.category || "General";
      const assignedProvider = await assignProvider(serviceCategory, district);

      const totalAmount = currentCart.reduce((sum, s) => sum + (s.price || 0), 0);

      const newBooking = {
        userId: user?.uid || "unknown_user",
        name: user?.displayName || "Customer",
        email: user?.email || "",
        phone,
        services: currentCart.map((item) => ({
          category: item.category,
          subService: item.name,
          price: item.price || 0,
        })),
        address: { line1: address, district, state, pincode },
        date,
        timeSlot,
        totalAmount,
        status: assignedProvider ? "assigned" : "pending",
        assignedProvider: assignedProvider || null,
        requestId: `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "bookings"), newBooking);
      localStorage.removeItem("cart");
      setCart([]);
      setBookingSuccess(true);
      toast.success("🎉 Booking confirmed successfully!");
    } catch (error) {
      console.error("🔥 Error adding booking:", error);
      toast.error("Something went wrong. Please try again.");
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

  // ✅ Show feedback form after success
  if (bookingSuccess) {
    return (
      <div className="checkout-success">
        <h2>✅ Thank you for your booking!</h2>
        <p>We truly appreciate your trust in <strong>SevaSetu India</strong>.</p>
        <p>Please take a moment to rate your experience below 👇</p>

        <FeedbackForm
  serviceName={cart[0]?.name || "Service"}
  category={cart[0]?.category || "General"}
  userName={user?.displayName || localStorage.getItem("userName") || "Guest"}
  userEmail={user?.email || localStorage.getItem("userEmail") || "guest@sevasetu.in"}
  place={district || ""}
/>

        <ToastContainer position="bottom-center" autoClose={4000} />
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <p>
        Logged in as: <strong>{user?.displayName || "Guest"}</strong>
      </p>

      <h3>
        Selected Services
        <span style={{ float: "right" }}>Total: ₹{total}</span>
      </h3>

      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul>
          {cart.map((s, i) => (
            <li key={i}>
              {s.name} – ₹{s.price}
            </li>
          ))}
        </ul>
      )}

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

        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
          <option value="">Select Time Slot</option>
          <option value="9 AM - 12 PM">9 AM - 12 PM</option>
          <option value="12 PM - 3 PM">12 PM - 3 PM</option>
          <option value="3 PM - 6 PM">3 PM - 6 PM</option>
        </select>

        <button disabled={loading} onClick={handleBooking}>
          {loading ? "Processing..." : "Confirm Booking"}
        </button>

        <button
          type="button"
          style={{ background: "#ccc", color: "#000" }}
          onClick={() => navigate("/cart")}
        >
          ← Back to Cart
        </button>
      </div>

      <ToastContainer position="bottom-center" autoClose={4000} />
    </div>
  );
}

export default CheckoutPage;
