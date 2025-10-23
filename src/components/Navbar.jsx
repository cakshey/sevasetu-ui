import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ log out from Firebase
      localStorage.removeItem("user");
      sessionStorage.clear();

      // Redirect & force reload so Navbar refreshes
      navigate("/logout-success");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
        {user ? (
          <>
            <div className="user-info">
              <img
                src="/assets/avatar.png"
                alt="User"
                className="user-avatar"
                onError={(e) => (e.target.style.display = "none")}
              />
              <span className="user-name">{user.displayName || "User"}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "#1746b8",
              color: "white",
              borderRadius: "6px",
              padding: "8px 16px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
