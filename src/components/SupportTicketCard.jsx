#SupportTicketCard.jsx
import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./SupportTicketCard.css";

export default function SupportTicketCard({ ticket, onStatusChange }) {
  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateDoc(doc(db, "contact_messages", ticket.id), {
        status: newStatus,
        updatedAt: new Date(),
      });
      if (onStatusChange) onStatusChange(ticket.id, newStatus);
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert("Failed to update status. Check console for details.");
    }
  };

  return (
    <div className={`ticket-card ${ticket.status}`}>
      <div className="ticket-info">
        <h4>{ticket.name}</h4>
        <p className="email">{ticket.email}</p>
        <p className="message">{ticket.message}</p>
        <p className="timestamp">
          Created: {ticket.createdAt?.toDate
            ? ticket.createdAt.toDate().toLocaleString()
            : ticket.createdAt}
        </p>
        <p>Status: <b>{ticket.status}</b></p>
      </div>

      <div className="ticket-actions">
        <button onClick={() => handleStatusUpdate("in_progress")}>In Progress</button>
        <button onClick={() => handleStatusUpdate("resolved")}>Resolved</button>
        <button onClick={() => handleStatusUpdate("escalated")}>Escalate</button>
      </div>
    </div>
  );
}
