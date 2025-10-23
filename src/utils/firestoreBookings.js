// src/utils/firestoreBookings.js
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const saveBooking = async (bookingData) => {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      createdAt: serverTimestamp(),
    });
    console.log("Booking stored with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving booking:", error);
    return { success: false, error };
  }
};
