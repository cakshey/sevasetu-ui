import React from "react";
import "./servicecard.css";

export default function ServiceCard({ title, subtitle, icon, cta }) {
  return (
    <div className="svc-card">
      <div className="svc-card__left">
        <div className="svc-card__icon">{icon}</div>
      </div>
      <div className="svc-card__body">
        <div className="svc-card__title">{title}</div>
        <div className="svc-card__subtitle">{subtitle}</div>
      </div>
      <div className="svc-card__cta">{cta}</div>
    </div>
  );
}
