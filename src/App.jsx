import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// 🔹 Core Components
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
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import GuestLogin from "./components/GuestLogin";
import AdminSupportDashboard from "./components/AdminSupportDashboard";
import BackupHistory from "./components/BackupHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminServiceReports from "./components/AdminServiceReports";
import AdminRevenueDashboard from "./pages/AdminRevenueDashboard";
import MyOrders from "./pages/MyOrders";
import AdminOrderManager from "./pages/AdminOrderManager";
import AdminOrders from "./pages/AdminOrders";

// 🛒 Cart & Floating UI
import FloatingCart from "./components/FloatingCart";
import CartPage from "./pages/CartPage";

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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/guest-login" element={<GuestLogin />} />

        {/* 🛒 Cart Routes */}
        <Route path="/cart" element={<CartPage />} />

        {/* 🔒 Protected User Routes */}
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
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* 🧰 Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
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
        <Route
          path="/assigned-providers"
          element={
            <ProtectedRoute>
              <AdminAssignedProviders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support-dashboard"
          element={
            <ProtectedRoute>
              <AdminSupportDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/backup-history"
          element={
            <ProtectedRoute>
              <BackupHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-revenue"
          element={
            <ProtectedRoute>
              <AdminRevenueDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-service-reports"
          element={
            <ProtectedRoute>
              <AdminServiceReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-order-manager"
          element={
            <ProtectedRoute>
              <AdminOrderManager />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* 🛒 Floating Cart visible globally */}
      <FloatingCart />

      <Footer />
    </Router>
  );
}

export default App;
