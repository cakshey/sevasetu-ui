import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBy9pw-y48RW2VMAKAsaYkoxUezbNbmTAE",
  authDomain: "sevasetu-mvp.firebaseapp.com",
  projectId: "sevasetu-mvp",
  storageBucket: "sevasetu-mvp.appspot.com",
  messagingSenderId: "715431765919",
  appId: "1:715431765919:web:7ab4caf4f5df92e9e4ffaa"
};

// Debug check (optional)
console.log("🔍 Firebase Config:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
