import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user info to localStorage for quick access
      localStorage.setItem("user", JSON.stringify(user));

      console.log("✅ Logged in user:", user.displayName);
      navigate("/"); // redirect to homepage
    } catch (error) {
      console.error("❌ Login failed:", error.message);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Please log in</h2>
      <p>You must log in to continue with your booking or feedback.</p>

      <button className="login-btn" onClick={handleGoogleLogin}>
        Login with Google
      </button>

      <p className="login-note">
        Powered by <strong>Firebase Authentication</strong>
      </p>
    </div>
  );
};

export default Login;
