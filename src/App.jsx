import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ServicesPage from "./components/ServicesPage";
import BookingConfirmation from "./components/BookingConfirmation";
import AdminFeedback from "./components/AdminFeedback";
import Footer from "./components/Footer";
import "./utils/importServices";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/admin-feedback" element={<AdminFeedback />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
