import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/logout-success");
  };

  return (
    <nav className="navbar">
      {/* LEFT SIDE */}
      <div className="nav-left" onClick={() => navigate("/")}>
        💜 <span className="brand">SevaSetu India</span>
      </div>

      {/* CENTER LINKS */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/admin-feedback" className="admin-link">
          Admin Feedback
        </Link>
      </div>

      {/* RIGHT SIDE USER INFO */}
      <div className="nav-right">
        <div className="user-info">
          <img
            src="/assets/avatar.png"
            alt="User"
            className="user-avatar"
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className="user-name">Akshey Chaubey</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
