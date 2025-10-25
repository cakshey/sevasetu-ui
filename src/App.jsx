import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ServicesPage from "./components/ServicesPage";
import BookingConfirmation from "./components/BookingConfirmation";
import AdminFeedback from "./components/AdminFeedback";
import LogoutSuccess from "./components/LogoutSuccess";
import Login from "./components/Login";
import Footer from "./components/Footer";
import ProtectedRoute from "./utils/ProtectedRoute"; // ✅ Protected wrapper
import MyBookings from "./components/MyBookings"; // ✅ New page
import "./utils/importServices";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

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
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />

        {/* 🔒 Protected Pages */}
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

        <Route path="/logout-success" element={<LogoutSuccess />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
