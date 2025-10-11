import React from "react";
import "./dropdown.css";

export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  icon,
}) {
  return (
    <div className="dropdown-field">
      {label && <label className="dropdown-label">{label}</label>}
      <div className="dropdown-wrapper">
        {icon && <span className="dropdown-icon">{icon}</span>}
        <select
          className="dropdown-select"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value || opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
