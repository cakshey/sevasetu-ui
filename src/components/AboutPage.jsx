import React from "react";
import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero text-center">
        <h1>About SevaSetu India</h1>
        <p>
          Connecting homes with trusted professionals — faster, safer, and smarter.
        </p>
      </section>

      {/* Story Section */}
      <section className="about-story container">
        <h2>Our Story</h2>
        <p>
          SevaSetu India was founded with one simple mission — to bridge the gap
          between Indian households and reliable service professionals. Whether
          you need an electrician, plumber, driver, cook, or home cleaner, we
          make finding verified and skilled professionals easy, secure, and
          affordable.
        </p>
        <p>
          Our journey began with the vision to empower local service providers
          and create a transparent, tech-enabled ecosystem for everyday home
          services across India.
        </p>
      </section>

      {/* Values Section */}
      <section className="about-values container">
        <h2>Our Core Values</h2>
        <ul>
          <li>
            <strong>🔒 Trust:</strong> All professionals are verified and background-checked.
          </li>
          <li>
            <strong>💡 Transparency:</strong> Clear, upfront pricing — no hidden costs.
          </li>
          <li>
            <strong>⭐ Quality:</strong> Skilled experts reviewed by real customers.
          </li>
          <li>
            <strong>🌍 Community:</strong> Empowering local workers with fair opportunities.
          </li>
        </ul>
      </section>

      {/* Vision Section */}
      <section className="about-vision text-center">
        <h3>Join Our Mission</h3>
        <p>
          Together, we’re building a smarter and more connected India — one home
          service at a time.
        </p>
        <p>
          💜 <strong>SevaSetu India</strong> — Your trusted bridge to quality service.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;
