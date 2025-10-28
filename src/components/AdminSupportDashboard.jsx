import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SupportTicketCard from "../components/SupportTicketCard";
import "./AdminSupportDashboard.css";

export default function AdminSupportDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧭 Fetch all contact messages from Firestore
  useEffect(() => {
    const fetchTickets = async () => {
      const snapshot = await getDocs(collection(db, "contact_messages"));
      const allTickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(allTickets);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  // 🧮 Basic analytics
  const total = tickets.length;
  const pending = tickets.filter(
    (t) => t.status === "new" || t.status === "in_progress"
  ).length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;

  if (loading) return <p className="loading">Loading Support Dashboard...</p>;

  return (
    <div className="admin-support-dashboard">
      <h2>📊 Admin Support Dashboard</h2>

      {/* Summary Section */}
      <div className="summary-cards">
        <div className="summary-card total">
          <h3>{total}</h3>
          <p>Total Requests</p>
        </div>
        <div className="summary-card pending">
          <h3>{pending}</h3>
          <p>Pending</p>
        </div>
        <div className="summary-card resolved">
          <h3>{resolved}</h3>
          <p>Resolved</p>
        </div>
      </div>

      {/* Ticket List */}
      <div className="tickets-list">
        {tickets.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          tickets.map((ticket) => (
            <SupportTicketCard key={ticket.id} ticket={ticket} />
          ))
        )}
      </div>
    </div>
  );
}
