import React from "react";
import "./ContactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <h2>📞 Contact Us</h2>
      <p>
        Have questions, feedback, or need assistance?  
        We're happy to help you!
      </p>

      <div className="contact-info">
        <p>
          <strong>Email:</strong> support@sevasetuindia.com
        </p>
        <p>
          <strong>Phone:</strong> +91 63643 97256
        </p>
        <p>
          <strong>Hours:</strong> Mon – Sat, 9:00 AM – 8:00 PM
        </p>
      </div>

      <a
        href="https://wa.me/916364397256"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-contact-btn"
      >
        💬 Chat on WhatsApp
      </a>
    </div>
  );
};

export default ContactPage;
