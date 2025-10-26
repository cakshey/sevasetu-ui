import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import thankImage from "../assets/thankyou.png";
import "./ThankYouPage.css";

function ThankYouPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [serviceName, setServiceName] = useState("");

  // ✅ Pick booking info from localStorage for personalization
  useEffect(() => {
    const lastBooking = localStorage.getItem("lastBooking");
    if (lastBooking) {
      const booking = JSON.parse(lastBooking);
      setUserName(booking.name || "Customer");
      if (Array.isArray(booking.services) && booking.services.length > 0) {
        setServiceName(booking.services[0].subService || "your service");
      } else if (booking.serviceName) {
        setServiceName(booking.serviceName);
      }
    }
  }, []);

  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        <img src={thankImage} alt="Thank You" className="thankyou-image" />
        <h1>Thank You</h1>
        <h3>SevaSetu India</h3>
        <p>
          Dear <strong>{userName}</strong>, your booking for{" "}
          <strong>{serviceName}</strong> has been received successfully.
        </p>
        <p>Our professional will contact you soon. 🙏</p>

        <button onClick={() => navigate("/services")}>
          Explore More Services
        </button>
      </div>
    </div>
  );
}

export default ThankYouPage;
