// ✅ Firebase core setup
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy9pw-y48RW2VMAKAsaYkoxUezbNbmTAE",
  authDomain: "sevasetu-mvp.firebaseapp.com",
  projectId: "sevasetu-mvp",
  storageBucket: "sevasetu-mvp.appspot.com", // ✅ corrected domain
  messagingSenderId: "715431765919",
  appId: "1:715431765919:web:7ab4caf4f5df92e9e4ffaa",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export everything needed across the app
export { app, auth, db, RecaptchaVerifier, signInWithPhoneNumber };
