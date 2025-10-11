import React from "react";
import "./hero.css";

export default function Hero({ title, subtitle, ctaText, onCtaClick }) {
  return (
    <section className="seva-hero">
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {ctaText && (
          <button className="hero-cta" onClick={onCtaClick}>
            {ctaText}
          </button>
        )}
      </div>
    </section>
  );
}
