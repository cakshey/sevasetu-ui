import React, { useState } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { app, db } from "../firebase";
import "./LaunchingSoonWidget.css";

export default function LaunchingSoonWidget() {
  const auth = getAuth(app);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    district: "Lucknow",
    role: "Customer",
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  // ✅ Initialize reCAPTCHA
  const initRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: isLocal ? "normal" : "invisible",
          callback: (response) => console.log("✅ reCAPTCHA verified:", response),
          "expired-callback": () => {
            console.warn("⚠️ reCAPTCHA expired — resetting...");
            window.recaptchaVerifier = null;
          },
        }
      );

      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
        console.log("🟢 reCAPTCHA ready, widget ID:", widgetId);
      });
    }
  };

  // ✅ Send OTP (test + production compatible)
  const handleSendOtp = async () => {
    if (!form.mobile || form.mobile.length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    const phoneNumber = "+91" + form.mobile;

    try {
      setLoading(true);

      // 🧪 Localhost testing: use fake OTP (no SMS)
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        auth.settings.appVerificationDisabledForTesting = true;
        console.log("🧪 Test mode active — using fake OTP config");

        setConfirmationResult({
          confirm: (otpInput) =>
            otpInput === "123456"
              ? Promise.resolve("Test verification success ✅")
              : Promise.reject(new Error("Invalid test OTP ❌")),
        });

        setMessage("✅ Test OTP sent (use 123456)");
        setLoading(false);
        return;
      }

      // 🌐 Production mode
      initRecaptcha();
      await new Promise((r) => setTimeout(r, 700));

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setMessage("✅ OTP sent successfully! Please check your phone.");
    } catch (err) {
      console.error("🚨 OTP Error:", err);
      if (err.code === "auth/invalid-app-credential") {
        setMessage("⚠️ Invalid app credentials. Refresh and try again.");
      } else if (err.code === "auth/missing-app-credential") {
        setMessage("⚠️ reCAPTCHA verification failed. Please retry.");
      } else {
        setMessage("Failed to send OTP. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      await confirmationResult.confirm(otp);
      setVerified(true);
      setMessage("✅ Mobile number verified successfully!");
    } catch (err) {
      console.error("❌ Invalid OTP:", err);
      setMessage("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit Waitlist Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      setMessage("Please verify your mobile number first.");
      return;
    }

    try {
      await addDoc(collection(db, "waitlist"), {
        ...form,
        verified: true,
        createdAt: serverTimestamp(),
      });

      setMessage("🎉 Successfully joined the waitlist!");
      setForm({
        name: "",
        mobile: "",
        district: "Lucknow",
        role: "Customer",
        email: "",
      });
      setOtp("");
      setVerified(false);
      setConfirmationResult(null);
    } catch (err) {
      console.error("Error saving to Firestore:", err);
      setMessage("Failed to save. Try again later.");
    }
  };

  return (
    <div className="launching-widget-wrapper">
      <div className="launching-widget">
        {/* LEFT SIDE */}
        <div className="launch-left">
          <h3>🚀 Launching Soon in Lucknow · Kanpur · Allahabad · Indore</h3>
          <p className="sub">
            Join early for exclusive rewards — early users get{" "}
            <span>₹100 Seva Credit</span> at launch.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <form onSubmit={handleSubmit} className="launch-form">
          <div className="row">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="row phone-otp">
            <input
              type="tel"
              placeholder="Mobile number (10 digits)"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              required
            />
            {!verified ? (
              <button
                id="send-otp-button"
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="otp-btn"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <span className="verified-badge">✅ Verified</span>
            )}
          </div>

          {/* reCAPTCHA Container */}
          <div id="recaptcha-container" style={{ marginTop: "10px" }}></div>

          {confirmationResult && !verified && (
            <div className="row phone-otp">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-input"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="otp-btn"
              >
                Verify OTP
              </button>
            </div>
          )}

          <div className="row">
            <select
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            >
              <option>Lucknow</option>
              <option>Kanpur</option>
              <option>Allahabad</option>
              <option>Indore</option>
            </select>

            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>Customer</option>
              <option>Professional</option>
            </select>
          </div>

          <div className="row">
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {message && (
            <p
              style={{
                color:
                  message.includes("✅") || message.includes("🎉")
                    ? "#d4ffd4"
                    : "#ffe6e6",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              {message}
            </p>
          )}

          <div className="row actions">
            <button type="submit" disabled={loading}>
              Join Waitlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
