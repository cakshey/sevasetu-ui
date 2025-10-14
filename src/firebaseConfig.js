import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCydqkCF03H064zq6FWtrzL4lyJLvUzTNY",
  authDomain: "sevasetuindia-6b3a8.firebaseapp.com",
  projectId: "sevasetuindia-6b3a8",
  storageBucket: "sevasetuindia-6b3a8.appspot.com",
  messagingSenderId: "957819799979",
  appId: "1:957819799979:web:b45bb73e19ce22bdbb34e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
