import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// 🔹 Components
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ServicesPage from "./components/ServicesPage";
import CheckoutPage from "./components/CheckoutPage";
import BookingConfirmation from "./components/BookingConfirmation";
import AdminFeedback from "./components/AdminFeedback";
import LogoutSuccess from "./components/LogoutSuccess";
import Login from "./components/Login";
import Footer from "./components/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";
import MyBookings from "./components/MyBookings";
import ThankYouPage from "./components/ThankYouPage";
import AdminAssignedProviders from "./components/AdminAssignedProviders";
import AdminDashboard from "./pages/AdminDashboard";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import GuestLogin from "./components/GuestLogin"; // ✅ FIXED IMPORT

// Utilities & Styles
import "./utils/importServices";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar user={currentUser} />

      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout-success" element={<LogoutSuccess />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/admin-assigned" element={<AdminAssignedProviders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/guest-login" element={<GuestLogin />} /> {/* ✅ ADDED GUEST LOGIN */}

        {/* 🔒 Protected Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-confirmation"
          element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-feedback"
          element={
            <ProtectedRoute>
              <AdminFeedback />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
