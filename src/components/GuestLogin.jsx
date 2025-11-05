import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import "./GuestLogin.css";

function GuestLogin() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);

  // 🔄 Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      console.log("✅ Guest login successful:", result.user.uid);

      // 🎉 Show success toast
      const toast = document.createElement("div");
      toast.className = "guest-toast";
      toast.innerText =
        "🎉 Welcome to SevaSetu India! You are now signed in as a Guest.";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      navigate("/");
    } catch (error) {
      console.error("❌ Guest login failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-login-page">
      <div className="guest-card shadow-lg">
        <div className="text-center">
          <h2 className="fw-bold text-primary mb-2">
            Welcome to <span className="text-gradient">SevaSetu India</span>
          </h2>
          <p className="text-muted mb-4">
            Experience seamless services. Continue as a guest or log in to track
            your bookings.
          </p>

          <button
            className="btn btn-primary btn-lg px-4"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            {loading ? "Please wait..." : "🚀 Continue as Guest"}
          </button>

          <p className="small text-muted mt-3">
            You can always create an account later to view your service history.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GuestLogin;
