import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./AdminFeedback.css";

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [avgRatings, setAvgRatings] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  // ✅ Always define hooks first (before any return)

  // 🔍 Fetch Feedback Data
  useEffect(() => {
    if (!isAuthorized) return; // run only after login

    async function fetchFeedback() {
      try {
        const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFeedbackList(data);
        setFilteredList(data);

        // ⭐ Compute average ratings per category
        const categoryRatings = {};
        data.forEach((f) => {
          if (f.category && f.rating) {
            if (!categoryRatings[f.category]) {
              categoryRatings[f.category] = { total: 0, count: 0 };
            }
            categoryRatings[f.category].total += f.rating;
            categoryRatings[f.category].count += 1;
          }
        });

        const averages = {};
        Object.keys(categoryRatings).forEach((cat) => {
          averages[cat] = (
            categoryRatings[cat].total / categoryRatings[cat].count
          ).toFixed(1);
        });
        setAvgRatings(averages);
      } catch (error) {
        console.error("❌ Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, [isAuthorized]);

  // 🔍 Search Filter (runs only after feedback is loaded)
  useEffect(() => {
    if (!isAuthorized) return;

    const filtered = feedbackList.filter(
      (f) =>
        f.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filtered);
  }, [searchTerm, feedbackList, isAuthorized]);

  // 🔐 Render Admin Login if not authorized
  if (!isAuthorized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9fbfd",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <h2 style={{ color: "#0d47a1", marginBottom: "10px" }}>🔐 Admin Login</h2>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          Access restricted to SevaSetu administrators.
        </p>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "260px",
            marginBottom: "15px",
            fontSize: "15px",
          }}
        />
        <button
          onClick={() => {
            if (password === "SevaSetuAdmin@123") setIsAuthorized(true);
            else alert("❌ Incorrect password");
          }}
          style={{
            background: "#1565c0",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "12px",
            background: "transparent",
            border: "none",
            color: "#1565c0",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  // ✅ Render Feedback Dashboard after login
  return (
    <div className="admin-feedback-page">
      <h2>🗂️ Customer Feedback Dashboard</h2>
      <p className="subtitle">
        Monitor feedback, ratings & trends from SevaSetu users.
      </p>

      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by service or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ⭐ Average Ratings Summary */}
      {Object.keys(avgRatings).length > 0 && (
        <div className="average-summary">
          <h3>⭐ Average Ratings by Category</h3>
          <div className="avg-grid">
            {Object.entries(avgRatings).map(([category, avg]) => (
              <div key={category} className="avg-card">
                <h4>{category}</h4>
                <p>{avg} / 5</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📊 Feedback Table */}
      {loading ? (
        <p className="loading">⏳ Loading feedback...</p>
      ) : filteredList.length === 0 ? (
        <p className="no-data">⚠️ No feedback found for this search.</p>
      ) : (
        <div className="feedback-table-container">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>⭐ Rating</th>
                <th>Service</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Comments</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((fb) => (
                <tr key={fb.id}>
                  <td className="rating">{"★".repeat(fb.rating || 0)}</td>
                  <td>{fb.serviceName}</td>
                  <td>{fb.category}</td>
                  <td>{fb.tags?.join(", ") || "—"}</td>
                  <td>{fb.comment || "—"}</td>
                  <td>
                    {fb.createdAt?.toDate
                      ? fb.createdAt.toDate().toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
