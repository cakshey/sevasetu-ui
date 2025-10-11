import React from "react";
import "./navbar.css";

export default function NavBar({ title = "SevaSetu", children }) {
  return (
    <nav className="nav-bar">
      <div className="nav-bar__left">
        <div className="nav-logo">SS</div>
        <h1 className="nav-title">{title}</h1>
      </div>
      <div className="nav-bar__right">{children}</div>
    </nav>
  );
}
