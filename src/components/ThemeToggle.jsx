import React from "react";
import { useTheme } from "../theme";
import "./themetoggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <div className="icon">{theme === "dark" ? "☀️" : "🌙"}</div>
    </button>
  );
}
