// ✅ SevaSetu India - Final Home Page (Hero + Login + Logout)
import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import UserLogin from "./UserLogin";
import FeedbackModal from "./FeedbackModal";
import "./HomePage.css";

const HomePage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // ✅ Load user if exists
  useEffect(() => {
    const savedUser = localStorage.getItem("sevasetu_user");
    if (savedUser) setLoggedInUser(JSON.parse(savedUser));
  }, []);

  // ✅ Handle login success
  const handleLogin = (phone) => {
    const user = { phone };
    setLoggedInUser(user);
    localStorage.setItem("sevasetu_user", JSON.stringify(user));
    setShowLogin(false);
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("sevasetu_user");
    setLoggedInUser(null);
  };

  return (
    <div className="homepage-wrapper">
      <HeroSection>
        {!loggedInUser ? (
          <button className="login-btn" onClick={() => setShowLogin(true)}>
            Login / Continue with Phone
          </button>
        ) : (
          <div className="welcome-box">
            <p className="welcome-msg">👋 Welcome, {loggedInUser.phone}</p>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </HeroSection>

      {/* ✅ Services */}
      <div className="services-wrapper">
        <ServicesSection />
      </div>

      {/* ✅ Login Popup */}
      {showLogin && (
        <UserLogin onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}

      {/* ✅ Feedback Modal (optional) */}
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
    </div>
  );
};

export default HomePage;
