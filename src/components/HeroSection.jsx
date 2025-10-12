// src/components/HeroSection.jsx
import React, { useState, useEffect } from "react";
import "./hero.css";

export default function HeroSection({ onExplore }) {
  const [gradient, setGradient] = useState(
    "linear-gradient(135deg, #007BFF 0%, #5BC0F8 100%)"
  );

  // Desktop: mouse-controlled gradient
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth) * 100;
    const y = (e.clientY / innerHeight) * 100;
    setGradient(`radial-gradient(at ${x}% ${y}%, #007BFF, #5BC0F8)`);
  };

  // Mobile: auto-breathing gradient
  useEffect(() => {
    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.5;
      const x = 50 + Math.sin(angle * Math.PI / 180) * 30;
      const y = 50 + Math.cos(angle * Math.PI / 180) * 30;
      setGradient(`radial-gradient(at ${x}% ${y}%, #007BFF, #5BC0F8)`);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="hero"
      style={{ background: gradient, transition: "background 0.5s ease" }}
      onMouseMove={handleMouseMove}
    >
      <div className="hero-content">
        <h1 className="hero-title">Empower Care, Instantly</h1>
        <p className="hero-subtitle">
          SevaSetu helps you connect with trusted home and care services — faster,
          safer, and smarter.
        </p>
        <button className="hero-btn" onClick={onExplore}>
          Explore Services
        </button>
      </div>
    </section>
  );
}
