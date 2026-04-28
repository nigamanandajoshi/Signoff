"use client";

import React from "react";

export default function LoadingState() {
  return (
    <div
      className="glass-card-static animate-fade-in-up"
      style={{
        padding: "32px",
        maxWidth: "560px",
        width: "100%",
        margin: "24px auto 0",
      }}
    >
      {/* Header shimmer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div className="shimmer" style={{ width: 40, height: 40, borderRadius: "50%" }} />
        <div className="shimmer" style={{ width: 120, height: 24, borderRadius: 6 }} />
        <div
          style={{
            fontSize: "20px",
            color: "var(--text-tertiary)",
            animation: "pulse-glow 1.5s ease-in-out infinite",
          }}
        >
          →
        </div>
        <div className="shimmer" style={{ width: 40, height: 40, borderRadius: "50%" }} />
        <div className="shimmer" style={{ width: 120, height: 24, borderRadius: 6 }} />
      </div>

      {/* Details shimmer */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="shimmer" style={{ width: 100, height: 16, borderRadius: 4 }} />
            <div className="shimmer" style={{ width: 140, height: 16, borderRadius: 4 }} />
          </div>
        ))}
      </div>

      {/* Route shimmer */}
      <div style={{ marginTop: "24px" }}>
        <div className="shimmer" style={{ width: 80, height: 14, borderRadius: 4, marginBottom: 12 }} />
        <div className="shimmer" style={{ width: "100%", height: 60, borderRadius: 8 }} />
      </div>

      {/* Loading message */}
      <div
        style={{
          textAlign: "center",
          marginTop: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid var(--border-subtle)",
            borderTopColor: "var(--accent-cyan)",
            borderRadius: "50%",
            animation: "spin-slow 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          Fetching quote from Jupiter...
        </span>
      </div>
    </div>
  );
}
