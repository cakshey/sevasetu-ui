import React from "react";
import { Link } from "react-router-dom";
import "./LogoutSuccess.css";

export default function LogoutSuccess() {
  return (
    <div className="logout-success">
      <h2>✅ You’ve been logged out successfully!</h2>
      <p>We hope to see you again soon.</p>
      <Link to="/" className="home-btn">Return to Home</Link>
    </div>
  );
}
