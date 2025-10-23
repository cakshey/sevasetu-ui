// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBy9pw-y48RW2VMAKAsaYkoxUezbNbmTAE",
  authDomain: "sevasetu-mvp.firebaseapp.com",
  projectId: "sevasetu-mvp",
  storageBucket: "sevasetu-mvp.appspot.com", // ✅ corrected
  messagingSenderId: "715431765919",
  appId: "1:715431765919:web:7ab4caf4f5df92e9e4ffaa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
