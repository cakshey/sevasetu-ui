import React, { useRef } from "react";

// 🔹 Component styles
import "./components/navbar.css";
import "./components/bottomnav.css";
import "./components/button.css";
import "./components/servicecard.css";
import "./components/inputfield.css";
import "./components/dropdown.css";
import "./components/modal.css";
import "./components/toast.css";
import "./components/hero.css";
import "./components/servicessection.css";
import "./components/themetoggle.css";
import "./components/sevasetu.tokens.css";

// 🔹 Components
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";
import InputField from "./components/InputField";
import Dropdown from "./components/Dropdown";
import Modal from "./components/Modal";
import ToastContainer from "./components/Toast";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";
import ThemeToggle from "./components/ThemeToggle";

// 🔹 Hooks & Theme Context
import { useModal } from "./useModal";
import { useToast } from "./useToast";
import { ThemeProvider } from "./theme";

export default function App() {
  // 🧩 Hooks
  const { isOpen, open, close } = useModal();
  const { toasts, showToast, removeToast } = useToast();

  // 🧭 Scroll reference
  const servicesRef = useRef(null);
  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ThemeProvider>
      {/* ---- NAVBAR ---- */}
      <NavBar title="SevaSetu Dashboard">
        <button className="nav-btn" onClick={open}>
          Open Dialog
        </button>
        <button className="nav-btn" onClick={scrollToServices}>
          Services
        </button>
        <button className="nav-btn">Profile</button>
        <ThemeToggle />
      </NavBar>

      {/* ---- HERO SECTION ---- */}
      <Hero
        title="Empower Care, Instantly"
        subtitle="SevaSetu helps you connect with trusted home and care services — faster, safer, and smarter."
        ctaText="Explore Services"
        onCtaClick={scrollToServices}
      />

      {/* ---- MAIN CONTENT ---- */}
      <main
        style={{
          minHeight: "80vh",
          background: "var(--bg)",
          color: "var(--text-primary)",
          padding: "40px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Form Inputs (Dark Theme)</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "360px",
          }}
        >
          <InputField label="Full Name" placeholder="Enter your name" icon="👤" />
          <InputField label="Email" type="email" placeholder="you@example.com" icon="📧" />
          <Dropdown
            label="Select Service"
            icon="🧰"
            options={[
              { label: "Home Cleaning" },
              { label: "Plumbing Assistance" },
              { label: "Electrician Visit" },
            ]}
          />
        </div>
      </main>

      {/* ---- SERVICES SECTION ---- */}
      <ServicesSection ref={servicesRef} />

      {/* ---- MODAL ---- */}
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Service Confirmation"
        footer={
          <>
            <button
              className="nav-btn"
              onClick={close}
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            >
              Cancel
            </button>
            <button
              className="nav-btn"
              style={{ background: "var(--brand-accent)", color: "#fff" }}
              onClick={() => {
                close();
                showToast(
                  "success",
                  "Service Confirmed",
                  "Your booking was successful!"
                );
              }}
            >
              Confirm
            </button>
          </>
        }
      >
        <p>Are you sure you want to book this service?</p>
      </Modal>

      {/* ---- TOASTS ---- */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ---- BOTTOM NAV ---- */}
      <BottomNav
        items={[
          { label: "Home", icon: "🏠", active: true },
          { label: "Services", icon: "🧰" },
          { label: "Profile", icon: "👤" },
        ]}
      />
    </ThemeProvider>
  );
}
