import React, { useState } from "react";
import "./AdminDashboard.css"; // ✅ reuse modal and clean styles
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const adminPass = process.env.REACT_APP_ADMIN_PASS;

    console.log("🔐 Admin Password Loaded:", adminPass);

    if (password === adminPass) {
      navigate("/admin");
    } else {
      alert("❌ Incorrect password. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>🔒 Admin Access</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#0044cc",
              color: "#fff",
              border: "none",
              padding: "10px 25px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
