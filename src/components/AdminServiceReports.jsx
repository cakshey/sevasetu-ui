// ✅ src/components/AdminServiceReports.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./AdminServiceReports.css";

const AdminServiceReports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalBookings: 0,
    totalFeedback: 0,
    avgRating: 0,
    topCategories: [],
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const bookingsSnap = await getDocs(collection(db, "bookings"));
        const feedbackSnap = await getDocs(collection(db, "feedback"));

        const bookings = bookingsSnap.docs.map((doc) => doc.data());
        const feedbacks = feedbackSnap.docs.map((doc) => doc.data());

        const totalBookings = bookings.length;
        const totalFeedback = feedbacks.length;
        const avgRating =
          feedbacks.length > 0
            ? (
                feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
                feedbacks.length
              ).toFixed(1)
            : 0;

        const categoryCount = {};
        bookings.forEach((b) => {
          const category = b.services?.[0]?.category || "Other";
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        const topCategories = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([category, count]) => ({ category, count }));

        setData({ totalBookings, totalFeedback, avgRating, topCategories });
      } catch (err) {
        console.error("Error fetching report data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading report...</div>;

  return (
    <div className="admin-report container mt-5">
      <h2 className="text-primary mb-3">📈 Service Performance Report</h2>

      <div className="report-summary mb-4">
        <div><strong>Total Bookings:</strong> {data.totalBookings}</div>
        <div><strong>Total Feedback:</strong> {data.totalFeedback}</div>
        <div><strong>Average Rating:</strong> ⭐ {data.avgRating}</div>
      </div>

      <h4>🏆 Top 5 Booked Categories</h4>
      <table className="table table-striped table-bordered mt-3">
        <thead>
          <tr>
            <th>Category</th>
            <th>Booking Count</th>
          </tr>
        </thead>
        <tbody>
          {data.topCategories.map((cat) => (
            <tr key={cat.category}>
              <td>{cat.category}</td>
              <td>{cat.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <a href="/admin-dashboard" className="btn btn-outline-secondary">
          ⬅ Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default AdminServiceReports;
