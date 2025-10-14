import React from "react";
import "./WhatsAppButton.css";

const WhatsAppButton = () => {
  // ✅ Replace this with your real WhatsApp number (no "+" or spaces)
  const phoneNumber = "919999999999";
  const message = "Hello SevaSetu Support, I need help with my booking.";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button className="whatsapp-float" onClick={handleClick} title="Chat on WhatsApp">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
      />
    </button>
  );
};

export default WhatsAppButton;
