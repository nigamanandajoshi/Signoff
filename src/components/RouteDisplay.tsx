"use client";

import React from "react";
import { ReviewData, RoutePlanStep } from "@/lib/types";
import { DEX_COLORS, DEFAULT_DEX_COLOR, TOKEN_METADATA } from "@/lib/constants";
import { fromRawAmount, formatAmount } from "@/lib/jupiter";
import TokenBadge from "./TokenBadge";

interface RouteDisplayProps {
  data: ReviewData;
}

export default function RouteDisplay({ data }: RouteDisplayProps) {
  const { quote, inputToken, outputToken } = data;
  const { routePlan } = quote;

  return (
    <div
      className="glass-card-static animate-fade-in-up animate-delay-2"
      style={{
        padding: "24px 32px",
        maxWidth: "560px",
        width: "100%",
        margin: "16px auto 0",
      }}
    >
      <h3
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "16px",
        }}
      >
        Route Details
      </h3>

      {/* ─── Visual Route Flow ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          marginBottom: "20px",
          padding: "12px 16px",
          background: "rgba(56, 189, 248, 0.03)",
          borderRadius: "var(--radius-md)",
          border: "1px solid rgba(56, 189, 248, 0.06)",
          overflowX: "auto",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Start Token */}
        <TokenBadge symbol={inputToken.symbol} logoURI={inputToken.logoURI} size="sm" />

        {routePlan.map((step, index) => {
          const dexColor = DEX_COLORS[step.swapInfo.label] || DEFAULT_DEX_COLOR;
          return (
            <React.Fragment key={index}>
              {/* Arrow with DEX label */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  padding: "0 6px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: dexColor,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.swapInfo.label}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "2px",
                      background: dexColor,
                      opacity: 0.5,
                    }}
                  />
                  <span style={{ color: dexColor, fontSize: "12px" }}>→</span>
                  <div
                    style={{
                      width: "24px",
                      height: "2px",
                      background: dexColor,
                      opacity: 0.5,
                    }}
                  />
                </div>
                {step.percent < 100 && (
                  <span
                    style={{
                      fontSize: "9px",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {step.percent}%
                  </span>
                )}
              </div>

              {/* Intermediate or End Token */}
              {index < routePlan.length - 1 ? (
                <IntermediateToken mint={step.swapInfo.outputMint} />
              ) : (
                <TokenBadge
                  symbol={outputToken.symbol}
                  logoURI={outputToken.logoURI}
                  size="sm"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ─── Route Step Cards ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {routePlan.map((step, index) => (
          <RouteStepCard
            key={index}
            step={step}
            index={index}
            total={routePlan.length}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Route Step Card ───

function RouteStepCard({
  step,
  index,
  total,
}: {
  step: RoutePlanStep;
  index: number;
  total: number;
}) {
  const dexColor = DEX_COLORS[step.swapInfo.label] || DEFAULT_DEX_COLOR;

  const inputInfo = TOKEN_METADATA[step.swapInfo.inputMint];
  const outputInfo = TOKEN_METADATA[step.swapInfo.outputMint];

  const inputSymbol = inputInfo?.symbol || step.swapInfo.inputMint.slice(0, 6) + "...";
  const outputSymbol = outputInfo?.symbol || step.swapInfo.outputMint.slice(0, 6) + "...";

  const inputDecimals = inputInfo?.decimals ?? 9;
  const outputDecimals = outputInfo?.decimals ?? 9;
  const feeDecimals = inputInfo?.decimals ?? 9;

  const inAmount = formatAmount(fromRawAmount(step.swapInfo.inAmount, inputDecimals));
  const outAmount = formatAmount(fromRawAmount(step.swapInfo.outAmount, outputDecimals));
  const feeAmount = fromRawAmount(step.swapInfo.feeAmount, feeDecimals);

  return (
    <div
      style={{
        padding: "14px 16px",
        background: "var(--bg-input)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Step Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--text-tertiary)",
              background: "var(--bg-card)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            Step {index + 1}/{total}
          </span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: dexColor,
            }}
          >
            {step.swapInfo.label}
          </span>
        </div>
        {step.percent < 100 && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--text-tertiary)",
              background: "rgba(56, 189, 248, 0.06)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {step.percent}% of trade
          </span>
        )}
      </div>

      {/* Token Flow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
        }}
      >
        <span style={{ color: "var(--text-secondary)" }}>
          {inAmount} {inputSymbol}
        </span>
        <span style={{ color: "var(--text-tertiary)" }}>→</span>
        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
          {outAmount} {outputSymbol}
        </span>
      </div>

      {/* Fee */}
      {parseFloat(feeAmount) > 0 && (
        <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
          Fee: {formatAmount(feeAmount)} {inputSymbol}
        </div>
      )}
    </div>
  );
}

// ─── Intermediate Token (for multi-hop display) ───

function IntermediateToken({ mint }: { mint: string }) {
  const info = TOKEN_METADATA[mint];
  const symbol = info?.symbol || mint.slice(0, 4) + "...";
  const logoURI = info?.logoURI;

  return (
    <TokenBadge symbol={symbol} logoURI={logoURI} size="sm" />
  );
}
