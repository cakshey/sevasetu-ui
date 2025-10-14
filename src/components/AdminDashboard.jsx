import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterService, setFilterService] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // current booking being edited
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const b = { id: doc.id, ...doc.data() };
        if (b.createdAt?.toDate) {
          const created = b.createdAt.toDate();
          const diffDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
          b.age = diffDays;
        } else {
          b.age = "—";
        }
        b.status = b.status || "Pending";
        b.reason = b.reason || "";
        return b;
      });
      setBookings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // === Filtered view ===
  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase());
    const matchesService = filterService ? b.service === filterService : true;
    const matchesDate = filterDate ? b.date === filterDate : true;
    return matchesSearch && matchesService && matchesDate;
  });

  // === Excel Export ===
  const exportToExcel = () => {
    if (!bookings.length) return alert("No data to export!");
    const worksheet = XLSX.utils.json_to_sheet(bookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `SevaSetu_Bookings_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // === Open edit modal ===
  const openEdit = (b) => {
    setEditing(b);
    setStatus(b.status || "Pending");
    setReason(b.reason || "");
  };

  // === Save changes ===
  const saveChanges = async () => {
    if (!editing) return;
    try {
      const ref = doc(db, "bookings", editing.id);
      await updateDoc(ref, { status, reason });
      alert("✅ Booking updated successfully!");
      setEditing(null);
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("❌ Failed to update booking.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>🛠️ Admin Dashboard</h2>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
        >
          <option value="">All Services</option>
          <option>Plumbing</option>
          <option>Electrical</option>
          <option>Cleaning</option>
          <option>Carpentry</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        <button className="export-btn" onClick={exportToExcel}>
          ⬇️ Export to Excel
        </button>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : filtered.length ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>City</th>
                <th>State</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.phone}</td>
                  <td>{b.email}</td>
                  <td>{b.service}</td>
                  <td>{b.date}</td>
                  <td>{b.timeSlot}</td>
                  <td>{b.city}</td>
                  <td>{b.state}</td>
                  <td
                    className={
                      b.status === "Completed"
                        ? "status-complete"
                        : "status-pending"
                    }
                  >
                    {b.status}
                  </td>
                  <td>{b.reason || "—"}</td>
                  <td>{b.age}</td>
                  <td>
                    <button className="edit-btn" onClick={() => openEdit(b)}>
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No matching bookings found.</p>
      )}

      {/* === Edit Modal === */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🧾 Update Booking Status</h3>

            <div className="modal-summary">
              <p><strong>Name:</strong> {editing.name}</p>
              <p><strong>Service:</strong> {editing.service}</p>
              <p><strong>Date:</strong> {editing.date}</p>
            </div>

            <label>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>Completed</option>
            </select>

            {status === "Pending" && (
              <>
                <label>Reason for Pending:</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason..."
                />
              </>
            )}

            <div className="modal-actions">
              <button className="save-btn" onClick={saveChanges}>
                💾 Save Changes
              </button>
              <button className="cancel-btn" onClick={() => setEditing(null)}>
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
