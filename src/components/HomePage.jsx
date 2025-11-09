// ✅ src/components/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import LaunchingSoonWidget from "./LaunchingSoonWidget";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);

  // 🧭 Fetch feedback (latest 10)
  useEffect(() => {
    const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"), limit(10));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFeedbackList(docs);
    });
    return () => unsub();
  }, []);

  // 🧾 Fetch total count
  useEffect(() => {
    const fetchTotalReviews = async () => {
      const allSnapshot = await getDocs(collection(db, "feedback"));
      setTotalReviews(allSnapshot.size);
    };
    fetchTotalReviews();
  }, []);

  // ⏳ Auto-scroll
  useEffect(() => {
    if (feedbackList.length === 0) return;
    const timer = setInterval(() => {
      setScrollIndex((prev) => (prev + 1) % feedbackList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [feedbackList]);

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

  const highlights = [
    {
      title: "Domestic Staff",
      img: "/assets/home/domestic.jpg",
      caption: "Housemaid, Cook, Driver, Security Guard",
    },
    {
      title: "Pest Control",
      img: "/assets/home/pest.jpg",
      caption: "Cockroach, Termite, Bed Bug, Disinfection",
    },
    {
      title: "Appliance Repair",
      img: "/assets/home/appliance.jpg",
      caption: "Electrical, Plumbing, AC, Appliance Repair",
    },
    {
      title: "Home Cleaning",
      img: "/assets/home/cleaning.jpg",
      caption: "Home, Kitchen, Bathroom, Sofa, Mattress",
    },
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fb = feedbackList[scrollIndex];

  return (
    <div className="home-container">
      {/* LEFT SIDE */}
      <div className="home-left">
        <h1>Home services at your doorstep</h1>
        <p>
          SevaSetu helps you connect with trusted home and care services — faster, safer, and smarter.
        </p>

        <LaunchingSoonWidget />

        <div className="category-section">
          <h3>What are you looking for?</h3>
          <input
            type="text"
            className="search-input"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="category-grid">
            {filteredCategories.map((cat, i) => (
              <div
                key={i}
                className="category-card"
                onClick={() =>
                  navigate(`/services?category=${encodeURIComponent(cat.title)}`)
                }
              >
                <img src={cat.icon} alt={cat.title} className="category-img" />
                <p>{cat.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="home-right">
        {/* 🖼️ Image Highlights */}
        <div className="image-grid">
          {highlights.map((item, index) => (
            <div className="image-card" key={index}>
              <img src={item.img} alt={item.title} />
              <div className="image-caption">
                <strong>{item.title}</strong>
                <br />
                {item.caption}
              </div>
            </div>
          ))}
        </div>

        {/* 💬 Feedback Widget */}
        <div className="feedback-widget">
          <h3>
            💬 What Our Customers Say{" "}
            {totalReviews > 0 && (
              <span className="review-count-static">
                ({feedbackList.length} of {totalReviews} Reviews)
              </span>
            )}
          </h3>

          {/* 🕓 Latest review date */}
          {feedbackList.length > 0 && fb?.createdAt?.toDate && (
            <p className="review-date">
              Latest review on:{" "}
              {fb.createdAt.toDate().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}

          {!fb ? (
            <p>No feedback yet — be the first to share!</p>
          ) : (
            <div key={fb.id} className="feedback-card fade-in">
              <p className="feedback-comment">
                <em>{fb.comment || "No comment provided."}</em>
              </p>
              <p className="feedback-rating">
                ⭐ {fb.rating}/5 — <b>{fb.serviceName || "Service"}</b>
              </p>
              <p className="feedback-meta">
                👤 {fb.name || "Anonymous"} — 📍 {fb.place || "Unknown"}
              </p>
              {Array.isArray(fb.tags) && fb.tags.length > 0 && (
                <div className="feedback-tags">
                  {fb.tags.map((t, i) => (
                    <span key={i} className="tag-chip">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
