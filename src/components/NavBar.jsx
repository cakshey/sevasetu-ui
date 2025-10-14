import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          ❤️ <span>SevaSetu India</span>
        </div>

        <nav className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link
            to="/services"
            className={location.pathname === "/services" ? "active" : ""}
          >
            Services
          </Link>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
          >
            Contact
          </Link>
          <Link
            to="/admin-login"
            className={location.pathname === "/admin-login" ? "active" : ""}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
