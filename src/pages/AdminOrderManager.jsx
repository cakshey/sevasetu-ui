import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import "./AdminOrderManager.css";

export default function AdminOrderManager() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
  });

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, async (snapshot) => {
      const orderList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = { id: docSnap.id, ...docSnap.data() };

          // 🔹 Load items subcollection
          const itemsSnap = await getDocs(
            collection(db, "orders", docSnap.id, "items")
          );
          data.items = itemsSnap.docs.map((itemDoc) => itemDoc.data());
          return data;
        })
      );

      setOrders(orderList);
      setLoading(false);

      // 🔹 Update statistics
      const pending = orderList.filter((o) => o.status === "pending").length;
      const completed = orderList.filter((o) => o.status === "Completed").length;
      const cancelled = orderList.filter((o) => o.status === "Cancelled").length;
      const revenue = orderList
        .filter((o) => o.status === "Completed")
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        total: orderList.length,
        pending,
        completed,
        cancelled,
        revenue,
      });
    });

    return () => unsub();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      alert(`Order ${orderId} marked as ${newStatus}!`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading)
    return (
      <div className="admin-orders-page">
        <p>Loading all orders...</p>
      </div>
    );

  return (
    <div className="admin-orders-page">
      <h2 className="admin-title">🧾 Admin Order Manager</h2>

      {/* ✅ Dashboard Summary */}
      <div className="summary-bar">
        <div className="summary-card total">
          <h4>Total Orders</h4>
          <p>{stats.total}</p>
        </div>
        <div className="summary-card pending">
          <h4>Pending</h4>
          <p>{stats.pending}</p>
        </div>
        <div className="summary-card completed">
          <h4>Completed</h4>
          <p>{stats.completed}</p>
        </div>
        <div className="summary-card cancelled">
          <h4>Cancelled</h4>
          <p>{stats.cancelled}</p>
        </div>
        <div className="summary-card revenue">
          <h4>Total Revenue</h4>
          <p>₹{stats.revenue}</p>
        </div>
      </div>

      {orders.length === 0 && <p>No orders found yet.</p>}

      {orders.map((order) => (
        <div key={order.id} className="admin-order-card">
          <div className="admin-order-header">
            <div>
              <h4>Order ID: {order.id}</h4>
              <p>
                User: <b>{order.userId}</b>
              </p>
              <p>
                Date:{" "}
                {order.createdAt?.toDate
                  ? order.createdAt.toDate().toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <div className="admin-status">
              <span
                className={`status-badge ${order.status?.toLowerCase() || "pending"}`}
              >
                {order.status}
              </span>
              <h4 className="admin-total">₹{order.totalAmount}</h4>
            </div>
          </div>

          <div className="admin-actions">
            <button
              onClick={() => updateStatus(order.id, "Completed")}
              className="btn-success"
            >
              Mark Completed ✅
            </button>
            <button
              onClick={() => updateStatus(order.id, "Cancelled")}
              className="btn-cancel"
            >
              Cancel ❌
            </button>
            <button
              className="btn-toggle"
              onClick={() =>
                setExpanded(expanded === order.id ? null : order.id)
              }
            >
              {expanded === order.id ? "Hide Items ▲" : "View Items ▼"}
            </button>
          </div>

          {expanded === order.id && (
            <div className="admin-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="admin-item">
                  <span>{item.name}</span>
                  <span>₹{item.sellPrice}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
