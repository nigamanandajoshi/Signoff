"use client";

import React, { useState } from "react";
import { RiskAssessment, RiskFlag } from "@/lib/types";

interface RiskFlagsProps {
  assessment: RiskAssessment;
}

export default function RiskFlags({ assessment }: RiskFlagsProps) {
  const { flags, overallRisk, riskScore } = assessment;

  if (flags.length === 0) {
    return (
      <div
        className="glass-card-static animate-fade-in-up animate-delay-1"
        style={{
          padding: "20px 32px",
          maxWidth: "560px",
          width: "100%",
          margin: "16px auto 0",
          borderColor: "rgba(52, 211, 153, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(52, 211, 153, 0.1)",
              border: "1px solid rgba(52, 211, 153, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ✓
          </div>
          <div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#34d399",
              }}
            >
              No risk signals detected
            </span>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-tertiary)",
                marginTop: "2px",
              }}
            >
              This swap appears safe based on our heuristics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const riskColors = {
    low: { bg: "rgba(52, 211, 153, 0.1)", border: "rgba(52, 211, 153, 0.25)", text: "#34d399", label: "Low Risk" },
    medium: { bg: "rgba(251, 191, 36, 0.1)", border: "rgba(251, 191, 36, 0.25)", text: "#fbbf24", label: "Medium Risk" },
    high: { bg: "rgba(248, 113, 113, 0.1)", border: "rgba(248, 113, 113, 0.25)", text: "#f87171", label: "High Risk" },
  };

  const colors = riskColors[overallRisk];

  return (
    <div
      className="glass-card-static animate-fade-in-up animate-delay-1"
      style={{
        padding: "24px 32px",
        maxWidth: "560px",
        width: "100%",
        margin: "16px auto 0",
        borderColor: colors.border,
      }}
    >
      {/* ─── Header ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            {overallRisk === "low" ? "✓" : overallRisk === "medium" ? "⚠" : "✕"}
          </div>
          <div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: colors.text,
              }}
            >
              {colors.label}
            </span>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-tertiary)",
                marginTop: "1px",
              }}
            >
              {flags.length} {flags.length === 1 ? "signal" : "signals"} detected
            </p>
          </div>
        </div>

        {/* Risk score meter */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "var(--bg-input)",
              borderRadius: "2px",
              overflow: "hidden",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: `${riskScore}%`,
                height: "100%",
                background: colors.text,
                borderRadius: "2px",
                transition: "width 0.6s ease-out",
              }}
            />
          </div>
          <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
            Score: {riskScore}/100
          </span>
        </div>
      </div>

      {/* ─── Flags ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {flags.map((flag, index) => (
          <FlagItem key={index} flag={flag} />
        ))}
      </div>
    </div>
  );
}

// ─── Flag Item ───

function FlagItem({ flag }: { flag: RiskFlag }) {
  const [expanded, setExpanded] = useState(false);

  const severityStyles = {
    info: {
      bg: "rgba(56, 189, 248, 0.06)",
      border: "rgba(56, 189, 248, 0.12)",
      text: "var(--text-accent)",
    },
    warning: {
      bg: "rgba(251, 191, 36, 0.06)",
      border: "rgba(251, 191, 36, 0.12)",
      text: "#fbbf24",
    },
    critical: {
      bg: "rgba(248, 113, 113, 0.06)",
      border: "rgba(248, 113, 113, 0.12)",
      text: "#f87171",
    },
  };

  const styles = severityStyles[flag.severity];

  return (
    <div
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
        transition: "all var(--transition-fast)",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-primary)",
          fontSize: "13px",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "14px" }}>{flag.icon}</span>
        <span style={{ flex: 1, fontWeight: 500 }}>{flag.title}</span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: styles.text,
            padding: "2px 6px",
            borderRadius: "3px",
            background: styles.bg,
            border: `1px solid ${styles.border}`,
          }}
        >
          {flag.severity}
        </span>
        <span
          style={{
            fontSize: "12px",
            color: "var(--text-tertiary)",
            transition: "transform var(--transition-fast)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div
          className="animate-slide-down"
          style={{
            padding: "0 14px 12px 36px",
            fontSize: "12px",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          {flag.description}
        </div>
      )}
    </div>
  );
}
