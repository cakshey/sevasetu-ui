import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import * as XLSX from "xlsx";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    totalBookings: 0,
    totalFeedback: 0,
    avgRating: 0,
    topCategory: "",
  });

  const [chartData, setChartData] = useState([]);
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const bookingsSnap = await getDocs(collection(db, "bookings"));
      const feedbackSnap = await getDocs(collection(db, "feedback"));

      const totalBookings = bookingsSnap.size;
      const totalFeedback = feedbackSnap.size;

      // Calculate average rating
      let avgRating = 0;
      if (totalFeedback > 0) {
        const totalRating = feedbackSnap.docs.reduce(
          (sum, doc) => sum + (doc.data().rating || 0),
          0
        );
        avgRating = (totalRating / totalFeedback).toFixed(1);
      }

      // Category counts
      const categoryCounts = {};
      bookingsSnap.forEach((doc) => {
        const data = doc.data();
        if (data.category) {
          categoryCounts[data.category] =
            (categoryCounts[data.category] || 0) + 1;
        }
      });

      const topCategory = Object.entries(categoryCounts).length
        ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0]
        : "N/A";

      setSummary({ totalBookings, totalFeedback, avgRating, topCategory });

      const formattedData = Object.entries(categoryCounts).map(
        ([category, count]) => ({
          category,
          count,
        })
      );

      setChartData(formattedData);

      // Trigger bar animation
      setTimeout(() => setAnimateBars(true), 200);
    }

    fetchData();
  }, []);

  const exportServiceReport = () => {
    const wb = XLSX.utils.book_new();
    const wsData = chartData.map((d) => ({
      Category: d.category,
      Bookings: d.count,
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Service Report");
    XLSX.writeFile(wb, "Service_Report.xlsx");
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">
        ⚙️ <span>SevaSetu Admin Dashboard</span>
      </h2>
      <p className="dashboard-subtitle">
        Manage, monitor, and export service analytics securely.
      </p>

      <div className="dashboard-content">
        {/* ✅ Left Summary Section */}
        <div className="summary-card">
          <h3 className="summary-title">📊 Service Reports Summary</h3>
          <div className="summary-stats">
            <p>
              <strong>Total Bookings:</strong> {summary.totalBookings}
            </p>
            <p>
              <strong>Total Feedback:</strong> {summary.totalFeedback}
            </p>
            <p>
              <strong>Avg. Rating:</strong> ⭐ {summary.avgRating}
            </p>
            <p>
              <strong>Top Category:</strong> {summary.topCategory}
            </p>
          </div>
          <button className="export-btn" onClick={exportServiceReport}>
            📤 Export Service Report
          </button>
        </div>

        {/* ✅ Right Chart Section */}
        <div className="chart-card">
          <h3 className="chart-title">📈 Service Bookings by Category</h3>

          {chartData.length > 0 ? (
            <div className="chart-placeholder">
              {chartData.map((d) => (
                <div key={d.category} className="chart-bar">
                  {/* 🔹 Value label above the bar */}
                  <span
                    className={`chart-value ${
                      animateBars ? "show" : ""
                    }`}
                    style={{
                      bottom: animateBars ? `${d.count * 3 + 25}px` : "0px",
                    }}
                  >
                    {d.count}
                  </span>

                  <div
                    className={`chart-fill ${animateBars ? "animate" : ""}`}
                    style={{ height: animateBars ? `${d.count * 3}px` : "0px" }}
                    title={`${d.category}: ${d.count}`}
                  ></div>
                  <span>{d.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No chart data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
