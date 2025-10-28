// ✅ src/components/AdminAssignedProviders.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import "./AdminAssignedProviders.css";

export default function AdminAssignedProviders() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  // Fetch bookings that have assigned providers
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const q = query(
          collection(db, "bookings"),
          where("assignedProvider", "!=", null),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(data);
      } catch (err) {
        console.error("Error fetching assigned bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [refresh]);

  const handleReenableProvider = async (providerId, providerName) => {
    if (!window.confirm(`Re-enable availability for ${providerName}?`)) return;

    try {
      const providerRef = doc(db, "service_providers", providerId);
      await updateDoc(providerRef, { available: true });
      alert(`✅ ${providerName} is now available for new bookings.`);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error re-enabling provider:", err);
      alert("❌ Failed to update provider availability.");
    }
  };

  if (loading) {
    return <div className="loading">⏳ Loading assigned bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="no-data">
        <h3>No assigned providers found yet.</h3>
      </div>
    );
  }

  return (
    <div className="admin-assigned-container">
      <h2>👷 Assigned Service Providers</h2>
      <p>Monitor provider load & manage availability</p>

      <table className="assigned-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Service</th>
            <th>Category</th>
            <th>Customer</th>
            <th>Provider Name</th>
            <th>District</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const p = b.assignedProvider || {};
            return (
              <tr key={b.id}>
                <td>{b.requestId || b.id}</td>
                <td>{b.services?.[0]?.subService || "—"}</td>
                <td>{b.services?.[0]?.category || "—"}</td>
                <td>{b.name || "Customer"}</td>
                <td>{p.name || "—"}</td>
                <td>{p.district || "—"}</td>
                <td>{p.rating || "—"}</td>
                <td>
                  <span
                    className={`status-badge ${
                      b.status === "assigned" ? "assigned" : "pending"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td>
                  <button
                    className="reenable-btn"
                    onClick={() => handleReenableProvider(p.id, p.name)}
                  >
                    Re-enable
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
