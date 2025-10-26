// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useCart } from "../context/CartContext"; // ✅ import CartContext
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { cart } = useCart(); // ✅ Live cart count

  // Watch for login/logout state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem("user", JSON.stringify(firebaseUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });
    return () => unsubscribe();
  }, []);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
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

      {/* RIGHT SIDE */}
      <div className="nav-right">
        {/* ✅ Live Cart Count */}
        <button className="cart-btn" onClick={() => navigate("/checkout")}>
          🛒 Cart ({cart.length})
        </button>

        {user ? (
          <>
            <div className="user-info">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="user-avatar" />
              ) : (
                <img
                  src="/assets/avatar.png"
                  alt="User"
                  className="user-avatar"
                />
              )}
              <span className="user-name">{user.displayName || "User"}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="logout-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
