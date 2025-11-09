import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      const ordersData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const orderData = { id: doc.id, ...doc.data() };

          // 🔹 Fetch subcollection "items"
          const itemsSnap = await getDocs(collection(db, "orders", doc.id, "items"));
          orderData.items = itemsSnap.docs.map((itemDoc) => itemDoc.data());

          return orderData;
        })
      );

      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading)
    return (
      <div className="orders-page">
        <p>Loading your orders...</p>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="orders-page">
        <h2>No orders found 🛍️</h2>
        <p>Go add something to your cart and check out!</p>
      </div>
    );

  return (
    <div className="orders-page">
      <h2 className="orders-title">📦 My Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <h4>
                Order ID: <span>{order.id}</span>
              </h4>
              <p className="order-date">
                {order.createdAt?.toDate
                  ? order.createdAt.toDate().toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div className="order-status">
              <span
                className={`status-badge ${
                  order.status?.toLowerCase() || "pending"
                }`}
              >
                {order.status || "Pending"}
              </span>
              <h4 className="order-total">₹{order.totalAmount || 0}</h4>
            </div>
          </div>

          <button
            className="toggle-btn"
            onClick={() =>
              setExpandedId(expandedId === order.id ? null : order.id)
            }
          >
            {expandedId === order.id ? "Hide Items ▲" : "View Items ▼"}
          </button>

          {expandedId === order.id && (
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
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
