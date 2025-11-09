import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnap = await getDocs(collection(db, "orders"));
      const data = querySnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="admin-orders">
      <h2>🧾 Manage Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="admin-order-card">
              <div className="order-top">
                <h4>Order ID: {order.id}</h4>
                <p>Total: ₹{order.totalAmount}</p>
                <p>Status: <strong>{order.status}</strong></p>
              </div>

              <div className="order-actions">
                <button
                  className="btn-approve"
                  onClick={() => handleStatusChange(order.id, "Approved")}
                >
                  ✅ Approve
                </button>
                <button
                  className="btn-complete"
                  onClick={() => handleStatusChange(order.id, "Completed")}
                >
                  🎯 Complete
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => handleStatusChange(order.id, "Cancelled")}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
