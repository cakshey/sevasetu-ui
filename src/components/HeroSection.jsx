import React from "react";
import "./hero.css";
import FloatingParticles from "./FloatingParticles";

const HeroSection = () => {
  return (
    <section className="hero-gradient">
      {/* Ambient particle glow layer */}
      <FloatingParticles />

      {/* Main content overlay */}
      <div className="hero-content">
        <h1>Empower Care, Instantly</h1>
        <p>
          SevaSetu helps you connect with trusted home and care services — faster,
          safer, and smarter.
        </p>
        <button className="hero-btn">Explore Services</button>
      </div>
    </section>
  );
};

export default HeroSection;
