import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Store user info for later use (e.g. FeedbackForm)
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userName", user.displayName || "Customer");
      localStorage.setItem("userEmail", user.email || "");

      alert(`Welcome ${user.displayName || "User"}!`);
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Setup reCAPTCHA (runs once)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA verified ✅"),
        }
      );
    }
    return window.recaptchaVerifier;
  };

  // ✅ Send OTP
  const sendOtp = async () => {
    if (!phoneNumber.match(/^[6-9]\d{9}$/))
      return alert("Enter a valid 10-digit phone number");

    const appVerifier = setupRecaptcha();

    try {
      setLoading(true);
      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phoneNumber,
        appVerifier
      );
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      alert("✅ OTP sent successfully!");
    } catch (error) {
      console.error("OTP send error:", error);
      alert("Failed to send OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    if (!otp || !confirmationResult)
      return alert("Enter OTP and make sure OTP was sent.");

    try {
      setLoading(true);
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // ✅ Store user info locally
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userName", user.displayName || "Customer");
      localStorage.setItem("userEmail", user.email || "");

      alert("🎉 Login successful!");
      navigate("/");
    } catch (error) {
      console.error("OTP verify error:", error);
      alert("❌ Invalid or expired OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Login</h2>

      {/* Google Login */}
      <button className="login-btn" onClick={handleGoogleLogin} disabled={loading}>
        {loading ? "Loading..." : "Login with Google"}
      </button>

      <hr style={{ margin: "20px 0" }} />

      {/* Phone Login */}
      {!isOtpSent ? (
        <div className="phone-login">
          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
          <button onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
          <div id="recaptcha-container"></div>
        </div>
      ) : (
        <div className="otp-verify">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
          />
          <button onClick={verifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
