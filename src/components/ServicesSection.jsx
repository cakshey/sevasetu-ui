import React, { forwardRef } from "react";
import "./servicecard.css";

const services = [
  {
    title: "Repair & Maintenance",
    desc: "Electrical, Plumbing, AC, Appliance Repair",
    details: "Upfront pricing • Verified pros",
    image: process.env.PUBLIC_URL + "/assets/service_repair.jpg",
  },
  {
    title: "Cleaning / Deep Cleaning",
    desc: "Home, Kitchen, Bathroom, Sofa, Mattress",
    details: "Upfront pricing • Verified pros",
    image: process.env.PUBLIC_URL + "/assets/service_cleaning.jpg",
  },
  {
    title: "Pest Control",
    desc: "Cockroach, Termite, Bed Bug, Disinfection",
    details: "Upfront pricing • Verified pros",
    image: process.env.PUBLIC_URL + "/assets/service_pestcontrol.jpg",
  },
  {
    title: "Domestic Staff",
    desc: "Housemaid, Cook, Driver, Security Guard",
    details: "Upfront pricing • Verified pros",
    image: process.env.PUBLIC_URL + "/assets/service_domestic.jpg",
  },
  {
    title: "Painting Services",
    desc: "Interior & exterior painting with quality materials",
    details: "Launching shortly",
    image: process.env.PUBLIC_URL + "/assets/service_painting.jpg",
  },
  {
    title: "Gardening & Landscaping",
    desc: "Beautify your outdoor space with expert care",
    details: "Under development",
    image: process.env.PUBLIC_URL + "/assets/service_gardening.jpg",
  },
];

const ServicesSection = forwardRef((props, ref) => {
  return (
    <section
      ref={ref}
      style={{
        background: "var(--surface)",
        padding: "50px 40px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          color: "var(--brand-primary)",
          marginBottom: "30px",
          fontWeight: "700",
        }}
      >
        Popular Services
      </h2>

      {/* Service Cards Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {services.map((service, index) => (
          <div
            key={index}
            className="service-card"
            style={{
              background: "#fff",
              borderRadius: "12px",
              width: "250px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              overflow: "hidden",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 5px 15px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={service.image}
              alt={service.title}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
              }}
            />
            <div style={{ padding: "14px 16px" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#333",
                  marginBottom: "6px",
                }}
              >
                {service.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#555",
                  marginBottom: "4px",
                }}
              >
                {service.desc}
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#777",
                  marginBottom: "12px",
                }}
              >
                {service.details}
              </p>
              <button
                style={{
                  backgroundColor: "#ff7b00",
                  border: "none",
                  color: "#fff",
                  fontWeight: "600",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  width: "100%",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(255,123,0,0.3)",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ff8f33")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ff7b00")
                }
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default ServicesSection;
