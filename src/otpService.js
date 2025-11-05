import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => console.log("reCAPTCHA verified ✅"),
      },
      auth
    );
  }
};

export const sendOTP = async (phoneNumber) => {
  try {
    setupRecaptcha();
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
    );
    window.confirmationResult = confirmationResult;
    alert("✅ OTP sent successfully!");
  } catch (error) {
    console.error("OTP sending failed:", error);
    if (error.code === "auth/too-many-requests") {
      alert("Too many OTP attempts. Please try again later.");
    } else if (error.code === "auth/invalid-phone-number") {
      alert("Invalid phone number format. Please use +91XXXXXXXXXX.");
    } else {
      alert("Failed to send OTP. Please try again.");
    }
  }
};

export const verifyOTP = async (otp) => {
  try {
    const result = await window.confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    console.error("OTP verification failed:", error);
    alert("Invalid OTP or expired session.");
    return null;
  }
};

export { auth };
