// ✅ SevaSetu India - Final Integrated App.js (with Login Protection)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🌐 Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// 🏠 Page Components
import HomePage from "./components/HomePage";
import ServicesSection from "./components/ServicesSection";
import BookingForm from "./components/BookingForm";
import ContactPage from "./components/ContactPage";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // 🔒 Added protection wrapper

// 🚨 Optional NotFound fallback
const NotFoundPage = () => (
  <div style={{ textAlign: "center", padding: "100px 20px" }}>
    <h2>404 — Page Not Found</h2>
    <p>
      Try visiting <code>/</code> or <code>/services</code>
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* 🏠 Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* 🧰 Services Page */}
        <Route path="/services" element={<ServicesSection />} />

        {/* 📞 Contact Page */}
        <Route path="/contact" element={<ContactPage />} />

        {/* 🔒 Protected Booking Route */}
        <Route
          path="/book/:service"
          element={
            <ProtectedRoute>
              <BookingForm />
            </ProtectedRoute>
          }
        />

        {/* 🧑‍💻 Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 🚨 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
      <WhatsAppButton />
    </Router>
  );
}

export default App;
