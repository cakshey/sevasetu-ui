import React, { useState } from "react";
import "./UserLogin.css";

const UserLogin = ({ onClose, onLogin }) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ simple 10-digit validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    // Save user to localStorage
    const user = { phone };
    localStorage.setItem("sevasetu_user", JSON.stringify(user));

    onLogin(phone);
    setPhone("");
  };

  return (
    <div className="userlogin-overlay">
      <div className="userlogin-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Login / Continue</h2>
        <p>Enter your phone number to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength="10"
          />
          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="submit-btn">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
