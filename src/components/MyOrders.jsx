// ✅ MyOrders.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("You must be logged in to view your orders.");
          setLoading(false);
          return;
        }

        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="orders-container">
        <p className="loading">⏳ Loading your orders...</p>
      </div>
    );

  if (error)
    return (
      <div className="orders-container">
        <p className="error-text">❌ {error}</p>
      </div>
    );

  return (
    <div className="orders-container">
      <h2 className="orders-title">📦 My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">You haven’t placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order ID: {order.id}</h3>
                <span className="order-date">
                  {new Date(order.createdAt?.toDate()).toLocaleString()}
                </span>
              </div>

              <ul className="order-items">
                {order.items.map((item, i) => (
                  <li key={i}>
                    <strong>{item.name}</strong> — ₹{item.sellPrice}
                  </li>
                ))}
              </ul>

              <div className="order-footer">
                <p className="total">Total: ₹{order.totalAmount}</p>
                <p
                  className={`status ${
                    order.status === "Completed"
                      ? "status-completed"
                      : "status-pending"
                  }`}
                >
                  {order.status || "Pending"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
