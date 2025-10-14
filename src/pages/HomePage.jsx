import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => (
  <div style={{ textAlign: "center", padding: "80px 20px" }}>
    <h1>Welcome to SevaSetu India</h1>
    <p>Connecting you with trusted home & care services instantly.</p>
    <Link to="/services">
      <button style={{ background: "#ff8a2b", border: "none", color: "#fff", padding: "12px 20px", borderRadius: "6px", cursor: "pointer" }}>
        Explore Services
      </button>
    </Link>
  </div>
);

export default HomePage;
