"use client";

import React from "react";
import { ReviewData } from "@/lib/types";
import TokenBadge from "./TokenBadge";

interface ReviewPanelProps {
  data: ReviewData;
}

export default function ReviewPanel({ data }: ReviewPanelProps) {
  const {
    inputToken,
    outputToken,
    formattedInAmount,
    formattedOutAmount,
    formattedMinReceived,
    exchangeRate,
    priceImpactSeverity,
    quote,
  } = data;

  const priceImpact = parseFloat(quote.priceImpactPct);

  return (
    <div
      className="glass-card-static animate-fade-in-up"
      style={{
        padding: "28px 32px",
        maxWidth: "560px",
        width: "100%",
        margin: "24px auto 0",
      }}
    >
      {/* ─── Token Flow Header ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TokenBadge
            symbol={inputToken.symbol}
            logoURI={inputToken.logoURI}
            size="lg"
          />
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {formattedInAmount}
          </span>
        </div>

        <div
          style={{
            fontSize: "20px",
            color: "var(--accent-cyan)",
            fontWeight: 300,
          }}
        >
          →
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TokenBadge
            symbol={outputToken.symbol}
            logoURI={outputToken.logoURI}
            size="lg"
          />
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
            className="gradient-text"
          >
            {formattedOutAmount}
          </span>
        </div>
      </div>

      {/* ─── Exchange Rate ─── */}
      <div
        style={{
          textAlign: "center",
          fontSize: "13px",
          color: "var(--text-secondary)",
          marginBottom: "24px",
          padding: "8px 16px",
          background: "rgba(56, 189, 248, 0.04)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(56, 189, 248, 0.08)",
        }}
      >
        {exchangeRate}
      </div>

      {/* ─── Detail Rows ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Minimum Received */}
        <DetailRow
          label="Minimum received"
          value={`${formattedMinReceived} ${outputToken.symbol}`}
          tooltip="The minimum amount you'll receive after accounting for slippage"
        />

        {/* Price Impact */}
        <DetailRow
          label="Price impact"
          value={
            <span className={`severity-${priceImpactSeverity}`}>
              {priceImpact < 0.01 ? "< 0.01%" : `${priceImpact.toFixed(2)}%`}
            </span>
          }
          badge={
            <span
              className={`severity-badge-${priceImpactSeverity}`}
              style={{
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {priceImpactSeverity}
            </span>
          }
        />

        {/* Slippage Tolerance */}
        <DetailRow
          label="Slippage tolerance"
          value={`${(quote.slippageBps / 100).toFixed(1)}%`}
        />

        {/* Swap Mode */}
        <DetailRow
          label="Swap mode"
          value={quote.swapMode === "ExactIn" ? "Exact Input" : "Exact Output"}
        />

        {/* Platform Fee */}
        {quote.platformFee && parseInt(quote.platformFee.amount) > 0 && (
          <DetailRow
            label="Platform fee"
            value={`${quote.platformFee.feeBps / 100}%`}
          />
        )}

        {/* Route Complexity */}
        <DetailRow
          label="Route"
          value={
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {data.hops === 1 ? "Direct swap" : `${data.hops} hops`}
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: 500,
                  background: "rgba(56, 189, 248, 0.08)",
                  color: "var(--text-accent)",
                  border: "1px solid rgba(56, 189, 248, 0.15)",
                }}
              >
                {data.routeComplexity}
              </span>
            </span>
          }
        />
      </div>
    </div>
  );
}

// ─── Helper Component ───

function DetailRow({
  label,
  value,
  badge,
  tooltip,
}: {
  label: string;
  value: React.ReactNode;
  badge?: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 0",
        borderBottom: "1px solid rgba(100, 120, 180, 0.06)",
      }}
      title={tooltip}
    >
      <span
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          fontWeight: 400,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          {value}
        </span>
        {badge}
      </div>
    </div>
  );
}
