import React, { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./ContactPage.css";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // ✅ Save to Firestore (contact_messages)
      await addDoc(collection(db, "contact_messages"), {
        name: form.name,
        email: form.email,
        message: form.message,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      // ✅ Trigger email notification via Cloud Function
      const functions = getFunctions();
      const sendSupportEmail = httpsCallable(functions, "sendSupportEmail");
      await sendSupportEmail({
        name: form.name,
        email: form.email,
        message: form.message,
      });

      setForm({ name: "", email: "", message: "" });
      setSuccess(true);
    } catch (error) {
      console.error("❌ Error submitting message:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <section className="contact-hero text-center">
        <h1>Contact Us</h1>
        <p>
          Have questions or feedback? Reach out to us anytime — our support team
          will respond within 24 hours.
        </p>
      </section>

      {/* Contact Form */}
      <div className="contact-form container">
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Message</label>
          <textarea
            name="message"
            rows="5"
            placeholder="Write your message here..."
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <p className="success-msg">
              ✅ Thank you! Your message has been submitted successfully.
            </p>
          )}
        </form>
      </div>

      {/* Contact Info */}
      <section className="contact-info text-center">
        <h3>📍 Head Office</h3>
        <p>SevaSetu India, Rajendra Nagar, Sahibabad, Ghaziabad, UP - 201005</p>

        <h3>📞 Support</h3>
        <p>Email: support@sevasetu.in | Phone: +91 6364397256</p>
      </section>

      {/* Google Map Embed */}
      <section className="contact-map container">
        <h3>📍 Find Us on Map</h3>
        <iframe
          title="SevaSetu India Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.772824357068!2d77.3638752746834!3d28.675999882361064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfbe7ef1b96e7%3A0x9f8e3f9c4a8d8452!2sRajendra%20Nagar%2C%20Sahibabad%2C%20Ghaziabad%2C%20Uttar%20Pradesh%20201005!5e0!3m2!1sen!2sin!4v1730123456789!5m2!1sen!2sin"
          width="100%"
          height="350"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
}

export default ContactPage;
