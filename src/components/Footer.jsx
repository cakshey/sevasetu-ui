// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/admin-login">Admin</Link>
      </div>

      <p className="footer-text">
        © {new Date().getFullYear()} <span>SevaSetu India</span> | All rights reserved.
      </p>

      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-link"
      >
        💬 Chat on WhatsApp
      </a>
    </footer>
  );
};

export default Footer;
