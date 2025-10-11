import React from "react";
import "./inputfield.css";

export default function InputField({
  label,
  placeholder = "Type here...",
  type = "text",
  value,
  onChange,
  icon,
}) {
  return (
    <div className="input-field">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className="input-box"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
