import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm">
      <div className="container-fluid px-3 px-md-5">
        {/* Logo / Brand */}
        <NavLink className="navbar-brand fw-bold d-flex align-items-center" to="/">
          💜 <span className="ms-2">SevaSetu India</span>
        </NavLink>

        {/* Hamburger Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services">
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>

            {/* 🧩 Admin Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle fw-semibold"
                href="#"
                id="adminMenu"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Admin
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminMenu">
                <li>
                  <NavLink className="dropdown-item" to="/admin">
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/admin-feedback">
                    Feedback
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/admin-assigned">
                    Assigned Providers
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/admin/support">
                    Support Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/admin/backups">
                    Backup History
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* 🧍 Auth Section */}
            {user ? (
              <>
                <li className="nav-item ms-lg-3">
                  <NavLink className="nav-link" to="/logout-success">
                    Logout
                  </NavLink>
                </li>
                <li className="nav-item ms-2">
                  <span className="badge bg-light text-primary px-2 py-1">
                    👋 {user.displayName || "Admin"}
                  </span>
                </li>
              </>
            ) : (
              <li className="nav-item ms-lg-3">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
