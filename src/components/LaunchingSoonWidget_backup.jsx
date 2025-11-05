/* global grecaptcha */
import React, { useState } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase"; // ✅ keep your initialized auth/db here
import "./LaunchingSoonWidget.css";

const LaunchingSoonWidget = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [userType, setUserType] = useState("Customer");
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Correct reCAPTCHA setup
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA verified ✅"),
          "expired-callback": () => console.warn("reCAPTCHA expired"),
        },
        auth
      );
    }
  };

  // ✅ Send OTP
  const sendOtp = async () => {
    if (!phoneNumber.match(/^[0-9]{10}$/)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, "+91" + phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      alert("✅ OTP sent successfully!");
    } catch (error) {
      console.error("OTP sending failed:", error);
      if (error.code === "auth/too-many-requests") {
        alert("Too many OTP attempts. Please try again later.");
      } else if (error.code === "auth/invalid-phone-number") {
        alert("Invalid phone number format.");
      } else {
        alert("Failed to send OTP. Please try again.");
      }
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => grecaptcha.reset(widgetId));
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    if (!otp || !confirmationResult) {
      alert("Please enter the OTP sent to your phone.");
      return;
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      alert("✅ Phone number verified successfully!");
      setVerified(true);
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save user data
  const saveUserData = async () => {
    if (!verified) {
      alert("Please verify your phone number first.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "waitlistUsers"), {
        name,
        city,
        phone: phoneNumber,
        email,
        userType,
        verified: true,
        createdAt: new Date().toISOString(),
      });
      alert("🎉 Successfully joined waitlist!");
      setName("");
      setCity("");
      setPhoneNumber("");
      setOtp("");
      setEmail("");
      setUserType("Customer");
      setVerified(false);
      setConfirmationResult(null);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Error saving user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="launching-widget-wrapper">
      <div className="launching-widget">
        {/* LEFT SIDE TEXT */}
        <div className="launch-left">
          <h3>🚀 Join Our Waitlist</h3>
          <p>
            <strong>Calling all Home Service Providers and Users!</strong>
            <br />
            Whether you're a <strong>Customer</strong> looking for trusted help
            or a <strong>Professional</strong> offering services,{" "}
            <span className="highlight-line">
              join SevaSetu early and earn ₹100 Seva Credit at launch.
            </span>
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="launch-form">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Mobile number (10 digits)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <div className="otp-row">
            <button onClick={sendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={verifyOtp} disabled={loading}>
              Verify OTP
            </button>
          </div>

          <div className="row">
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select City</option>
              <option value="Lucknow">Lucknow</option>
              <option value="Kanpur">Kanpur</option>
              <option value="Allahabad">Allahabad</option>
              <option value="Indore">Indore</option>
            </select>

            <select value={userType} onChange={(e) => setUserType(e.target.value)}>
              <option value="Customer">Customer</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={saveUserData} className="join-btn" disabled={loading}>
            {loading ? "Saving..." : "Join Waitlist"}
          </button>
        </div>
      </div>

      {/* Required for Recaptcha */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default LaunchingSoonWidget;
