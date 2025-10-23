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
import Footer from "./components/Footer";
import "./utils/importServices";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // ✅ Track Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {/* Pass user info to Navbar */}
      <Navbar user={currentUser} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/admin-feedback" element={<AdminFeedback />} />
        <Route path="/logout-success" element={<LogoutSuccess />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
