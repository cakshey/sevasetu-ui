// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCydqc6F03H0462qFWttrzL4UyJLvJ2uTMY",
  authDomain: "sevasetuindia-6b3a8.firebaseapp.com",
  projectId: "sevasetuindia-6b3a8",
  storageBucket: "sevasetuindia-6b3a8.appspot.com",
  messagingSenderId: "957819979979",
  appId: "1:957819979979:web:b45bb73e19ce22bbdb34e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
