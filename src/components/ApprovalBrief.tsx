"use client";

import React, { useState } from "react";
import { ApprovalBrief as ApprovalBriefType } from "@/lib/types";
import { briefToText } from "@/lib/brief";

interface ApprovalBriefProps {
  brief: ApprovalBriefType;
}

export default function ApprovalBrief({ brief }: ApprovalBriefProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = briefToText(brief);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const text = briefToText(brief);
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const verdictBorder = {
    low: "rgba(52, 211, 153, 0.3)",
    medium: "rgba(251, 191, 36, 0.3)",
    high: "rgba(248, 113, 113, 0.3)",
  };

  const verdictGlow = {
    low: "rgba(52, 211, 153, 0.06)",
    medium: "rgba(251, 191, 36, 0.06)",
    high: "rgba(248, 113, 113, 0.06)",
  };

  const verdictIcon = {
    low: "✅",
    medium: "⚠️",
    high: "🚨",
  };

  return (
    <div
      className="glass-card-static animate-fade-in-up animate-delay-3"
      style={{
        padding: "28px 32px",
        maxWidth: "560px",
        width: "100%",
        margin: "16px auto 0",
        borderColor: verdictBorder[brief.verdictSeverity],
        position: "relative",
      }}
    >
      {/* ─── Header ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "14px" }}>📋</span>
          Approval Brief
        </h3>

        <button
          id="copy-brief-btn"
          onClick={handleCopy}
          className="btn-secondary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            padding: "5px 12px",
          }}
        >
          {copied ? (
            <>
              <span style={{ color: "#34d399" }}>✓</span> Copied
            </>
          ) : (
            <>
              <span>📋</span> Copy Brief
            </>
          )}
        </button>
      </div>

      {/* ─── Summary ─── */}
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-primary)",
          lineHeight: 1.7,
          marginBottom: "20px",
          fontWeight: 400,
        }}
      >
        {brief.summary}
      </p>

      {/* ─── Details ─── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "20px",
          padding: "16px",
          background: "var(--bg-input)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {brief.details.map((detail, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              padding: "2px 0",
            }}
          >
            <span style={{ color: "var(--text-tertiary)" }}>
              {detail.label}
            </span>
            <span
              style={{
                color: "var(--text-primary)",
                fontWeight: 500,
                textAlign: "right",
              }}
            >
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* ─── Route Explanation ─── */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "6px",
          }}
        >
          Route
        </h4>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          {brief.routeExplanation}
        </p>
      </div>

      {/* ─── Warnings ─── */}
      {brief.warnings.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#fbbf24",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
            }}
          >
            Warnings
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {brief.warnings.map((warning, i) => (
              <p
                key={i}
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  padding: "8px 12px",
                  background: "rgba(251, 191, 36, 0.04)",
                  border: "1px solid rgba(251, 191, 36, 0.1)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {warning}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ─── Verdict ─── */}
      <div
        style={{
          padding: "16px",
          background: verdictGlow[brief.verdictSeverity],
          border: `1px solid ${verdictBorder[brief.verdictSeverity]}`,
          borderRadius: "var(--radius-md)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "18px", lineHeight: 1 }}>
            {verdictIcon[brief.verdictSeverity]}
          </span>
          <div>
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "4px",
              }}
            >
              Verdict
            </h4>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-primary)",
                lineHeight: 1.6,
              }}
            >
              {brief.verdict}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Timestamp ─── */}
      <p
        style={{
          fontSize: "10px",
          color: "var(--text-tertiary)",
          textAlign: "right",
          marginTop: "12px",
          opacity: 0.7,
        }}
      >
        Generated by Signoff · {new Date(brief.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
