import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
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

  // Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      alert("Login failed. Please try again.");
      console.error(error);
    }
  };

  // Setup reCAPTCHA
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

  // Send OTP
  const sendOtp = async () => {
    if (!phoneNumber) return alert("Enter a valid phone number");
    const appVerifier = setupRecaptcha();
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phoneNumber,
        appVerifier
      );
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("OTP send error:", error);
      alert("Failed to send OTP: " + error.message);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp || !confirmationResult)
      return alert("Enter OTP and make sure OTP is sent.");
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("OTP verify error:", error);
      alert("Invalid or expired OTP. Try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Login</h2>

      {/* Google Login */}
      <button className="login-btn" onClick={handleGoogleLogin}>
        Login with Google
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
          />
          <button onClick={sendOtp}>Send OTP</button>
          <div id="recaptcha-container"></div>
        </div>
      ) : (
        <div className="otp-verify">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default Login;
