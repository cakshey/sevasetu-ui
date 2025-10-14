import React from "react";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  const services = [
    { name: "Cleaning", desc: "Home & office cleaning" },
    { name: "Plumbing", desc: "Fix leaks and installations" },
    { name: "Electrical", desc: "Repairs, wiring, appliances" },
    { name: "Painting", desc: "Professional wall painting" },
  ];

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Our Services</h1>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {services.map((s) => (
          <div key={s.name} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", width: "220px", background: "#fff" }}>
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <Link to={`/book/${encodeURIComponent(s.name)}`}>
              <button style={{ background: "#ff8a2b", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }}>
                Book Now
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
