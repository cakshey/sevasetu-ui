import React, { useEffect, useRef } from "react";
import "./particles.css";

const FloatingParticles = ({ isDarkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 260;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.6,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const glowColor = isDarkMode ? "#64b5f6" : "#1976d2"; // light blue vs deep blue
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = glowColor;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animationFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [isDarkMode]);

  return <canvas ref={canvasRef} className="particle-layer" />;
};

export default FloatingParticles;
