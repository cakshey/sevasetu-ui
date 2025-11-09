import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const cartCount = cart?.length || 0;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/logout-success");
  };

  return (
    <nav className="navbar">
      {/* ===== Brand Logo (matches footer) ===== */}
      <Link to="/" className="navbar-logo">
        <span className="logo-emoji">💜</span>
        <span className="logo-text">SevaSetu India</span>
      </Link>

      {/* ===== Navigation Links ===== */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/my-orders">My Orders</Link>

        {/* ===== Admin Dropdown ===== */}
        <div className="nav-dropdown">
          <button>Admin ▼</button>
          <div className="nav-dropdown-menu">
            <Link to="/admin-dashboard">Dashboard</Link>
            <Link to="/admin-orders">Orders</Link>
            <Link to="/admin-feedback">Feedback</Link>
            <Link to="/assigned-providers">Assigned Providers</Link>
            <Link to="/support-dashboard">Support Dashboard</Link>
            <Link to="/backup-history">Backup History</Link>
            <Link to="/admin-revenue">Revenue Dashboard</Link>
            <Link to="/admin-service-reports">Service Reports</Link>
          </div>
        </div>

        {/* ===== Cart & Logout ===== */}
        <div className="cart-section">
          <Link to="/cart" className="cart-icon">
            🛒
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
