// src/authService.js
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("✅ Logged in:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("❌ Login error:", error.code, error.message);
    alert("Login failed. Please try again.");
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("✅ User logged out");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export { auth };
