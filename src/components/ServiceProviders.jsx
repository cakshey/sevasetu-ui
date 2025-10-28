// ✅ src/components/ServiceProviders.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import "./ServiceProviders.css";

export default function ServiceProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const q = query(collection(db, "service_providers"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProviders(data);
      } catch (error) {
        console.error("Error fetching service providers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const filtered = providers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="providers-page">
      <h2>👷 Service Providers Directory</h2>
      <p>Manage and view registered professionals by category and region.</p>

      <input
        type="text"
        placeholder="🔍 Search by name, category, or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {loading ? (
        <p className="loading">⏳ Loading service providers...</p>
      ) : filtered.length === 0 ? (
        <p className="no-data">⚠️ No providers found.</p>
      ) : (
        <div className="providers-grid">
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`provider-card ${p.verified ? "verified" : ""}`}
            >
              <div className="card-header">
                <h3>{p.name}</h3>
                <span className="category">{p.category}</span>
              </div>
              <p><strong>📱</strong> {p.phone}</p>
              <p><strong>📍</strong> {p.city}, {p.district}</p>
              <p><strong>🧰</strong> {p.subCategory || "—"}</p>
              <p><strong>⭐</strong> {p.rating || "—"} ({p.jobsCompleted} jobs)</p>
              <p><strong>🏷️</strong> {p.tags?.join(", ") || "—"}</p>
              <p><strong>Status:</strong> {p.availability ? "🟢 Available" : "🔴 Busy"}</p>
              {p.verified && <div className="verified-badge">✅ Verified</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
