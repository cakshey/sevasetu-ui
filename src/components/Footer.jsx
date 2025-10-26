import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* 🔹 Logo Section */}
        <div className="footer-logo">
          <h2>💜 SevaSetu India</h2>
          <p>Connecting homes with trusted professionals — faster, safer, and smarter.</p>
        </div>

        {/* 🔹 Company Info */}
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* 🔹 For Customers */}
        <div className="footer-section">
          <h4>For Customers</h4>
          <ul>
            <li><a href="/services">Our Services</a></li>
            <li><a href="#reviews">Customer Reviews</a></li>
            <li><a href="#support">Help & Support</a></li>
          </ul>
        </div>

        {/* 🔹 For Professionals */}
        <div className="footer-section">
          <h4>For Professionals</h4>
          <ul>
            <li><a href="#join">Join as a Professional</a></li>
            <li><a href="#partner">Partner Program</a></li>
          </ul>
        </div>

        {/* 🔹 Social Links */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">🌐</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>

          <div className="app-buttons">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Available_on_the_App_Store_%28black%29_SVG.svg"
              alt="App Store"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
            />
          </div>
        </div>
      </div>

      {/* 🔹 Bottom Note */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SevaSetu India. All rights reserved.</p>
        <p className="small-text">
          A community-driven platform helping Indian households find reliable services and local professionals.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
