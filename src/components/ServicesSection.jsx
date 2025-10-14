import React from "react";
import "./servicessection.css";
import {
  FaUserTie,
  FaBroom,
  FaBolt,
  FaPaintRoller,
  FaTools,
  FaSnowflake,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const services = [
    { icon: <FaUserTie />, title: "Women's Salon & Spa", link: "/book/Salon" },
    { icon: <FaUserTie />, title: "Men's Salon & Massage", link: "/book/Massage" },
    { icon: <FaBroom />, title: "Cleaning & Pest Control", link: "/book/Cleaning" },
    { icon: <FaBolt />, title: "Electrician, Plumber & Carpenter", link: "/book/Plumbing" },
    { icon: <FaPaintRoller />, title: "Painting & Waterproofing", link: "/book/Painting" },
    { icon: <FaTools />, title: "Native Water Purifier", link: "/book/WaterPurifier" },
    { icon: <FaSnowflake />, title: "AC & Appliance Repair", link: "/book/AC" },
    { icon: <FaTools />, title: "Wall Makeover & Carpentry", link: "/book/Carpentry" },
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        <h2 className="services-title">Home services at your doorstep</h2>
        <p className="services-subtitle">What are you looking for?</p>

        <div className="service-grid">
          {services.map((service, index) => (
            <Link to={service.link} key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <p className="service-title">{service.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
