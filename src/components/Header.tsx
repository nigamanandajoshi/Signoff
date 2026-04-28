"use client";

import React from "react";

export default function Header() {
  return (
    <header
      style={{
        width: "100%",
        padding: "24px 0 20px",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        {/* Logo Mark */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: 800,
            color: "white",
            boxShadow: "0 4px 20px rgba(34, 211, 238, 0.3)",
          }}
        >
          S
        </div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
          className="gradient-text"
        >
          Signoff
        </h1>
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          fontWeight: 400,
          letterSpacing: "0.02em",
        }}
      >
        Review before you sign
      </p>

      {/* Accent line */}
      <div
        className="accent-line"
        style={{
          width: "60px",
          margin: "16px auto 0",
        }}
      />
    </header>
  );
}
