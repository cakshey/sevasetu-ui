import React from "react";
import "./hero.css";

const HeroSection = ({ children }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Empower Care, Instantly</h1>
        <p>
          SevaSetu helps you connect with trusted home and care services —
          faster, safer, and smarter.
        </p>
        <button
          className="explore-btn"
          onClick={() => (window.location.href = "/services")}
        >
          Explore Services
        </button>

        {/* ✅ Place for Login / Welcome message (from HomePage.jsx) */}
        <div className="hero-extra">{children}</div>
      </div>

      {/* ✅ Wave Effect for Aesthetic Transition */}
      <svg
        className="hero-wave"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
      >
        <path
          fill="#f8f9fb"
          d="M0,80 C480,150 960,0 1440,80 L1440,150 L0,150 Z"
        ></path>
      </svg>
    </section>
  );
};

export default HeroSection;
