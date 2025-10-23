import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore";
import { db } from "../firebase";
import "./HomePage.css";

// ✅ Category icons (from public/assets/icons)
const categories = [
  { title: "Women's Salon & Spa", icon: "/assets/icons/women-salon.png" },
  { title: "Men's Salon & Massage", icon: "/assets/icons/men-salon.png" },
  { title: "Cleaning & Pest Control", icon: "/assets/icons/cleaning.png" },
  { title: "Electrician, Plumber & Carpenter", icon: "/assets/icons/electrician.png" },
  { title: "Painting & Waterproofing", icon: "/assets/icons/painting.png" },
  { title: "Native Water Purifier", icon: "/assets/icons/purifier.png" },
  { title: "AC & Appliance Repair", icon: "/assets/icons/ac-repair.png" },
  { title: "Wall Makeover by Revamp", icon: "/assets/icons/wall-makeover.png" },
];

// ✅ Right side image grid (Service highlights)
const highlights = [
  {
    title: "Domestic Staff",
    img: "/assets/domestic-staff.jpg",
    caption: "Housemaid, Cook, Driver, Security Guard",
  },
  {
    title: "Pest Control",
    img: "/assets/pest-control.jpg",
    caption: "Cockroach, Termite, Bed Bug, Disinfection",
  },
  {
    title: "Appliance Repair",
    img: "/assets/appliance-repair.jpg",
    caption: "Electrical, Plumbing, AC, Appliance Repair",
  },
  {
    title: "Home Painting",
    img: "/assets/home-painting.jpg",
    caption: "Home, Kitchen, Bathroom, Sofa, Mattress",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackList, setFeedbackList] = useState([]); // ✅ renamed to match usage

  // ✅ Handles category click → navigates with URL param
  const handleCategoryClick = (category) => {
    const encoded = encodeURIComponent(category);
    navigate(`/services?category=${encoded}`);
  };

  // ✅ Filter categories based on search input
  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Fetch recent feedback (testimonials)
  useEffect(() => {
    async function loadFeedback() {
      try {
        const q = query(
          collection(db, "feedback"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setFeedbackList(data);
      } catch (err) {
        console.error("❌ Error loading feedback:", err);
      }
    }
    loadFeedback();
  }, []);

  return (
    <div className="home-container">
      {/* LEFT SIDE */}
      <div className="home-left">
        <h1>Home services at your doorstep</h1>
        <p>
          SevaSetu helps you connect with trusted home and care services — faster, safer, and smarter.
        </p>

        <div className="category-section">
          <h3>What are you looking for?</h3>

          {/* 🔍 Search Bar */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* ✅ Filtered Category Grid */}
          <div className="category-grid">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, index) => (
                <div
                  key={index}
                  className="category-card"
                  onClick={() => handleCategoryClick(cat.title)}
                >
                  <img src={cat.icon} alt={cat.title} className="category-img" />
                  <p className="category-label">{cat.title}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#666" }}>No services found.</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="home-right">
        <div className="image-grid">
          {highlights.map((img, index) => (
            <div className="image-card" key={index}>
              <img src={img.img} alt={img.title} />
              <div className="image-caption">
                <strong>{img.title}</strong>
                <br />
                {img.caption}
              </div>
            </div>
          ))}
        </div>

        {/* 🗣️ Feedback / Testimonials Section */}
        <div className="feedback-widget">
          <h3 className="feedback-title">
            💬 What Our Customers Say{" "}
            {feedbackList.length > 0 && (
              <span className="feedback-count">
                ({feedbackList.length} Reviews)
              </span>
            )}
          </h3>

          {feedbackList.length === 0 ? (
            <p className="no-feedback">No feedback yet — be the first to review!</p>
          ) : (
            feedbackList.map((fb, index) => (
              <div key={index} className="feedback-card">
                <p className="feedback-comment">
                  <em>{fb.comment || "No comment provided."}</em>
                </p>
                <p className="feedback-rating">
                  ⭐ {fb.rating}/5 — <strong>{fb.serviceName}</strong>
                </p>
                <p className="feedback-meta">
                  👤 {fb.userName || "Anonymous"} — 📍 {fb.location || "Unknown"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
