"use client";

import React, { useState, useCallback } from "react";
import { SELECTABLE_TOKENS, TOKEN_METADATA, TOKENS, SLIPPAGE_OPTIONS } from "@/lib/constants";
import TokenBadge from "./TokenBadge";

interface SwapInputProps {
  onReview: (params: {
    inputMint: string;
    outputMint: string;
    amount: string;
    slippageBps: number;
  }) => void;
  isLoading: boolean;
  isCompact?: boolean;
}

export default function SwapInput({ onReview, isLoading, isCompact = false }: SwapInputProps) {
  const [inputMint, setInputMint] = useState(TOKENS.SOL);
  const [outputMint, setOutputMint] = useState(TOKENS.USDC);
  const [amount, setAmount] = useState("");
  const [slippageBps, setSlippageBps] = useState(50);
  const [customSlippage, setCustomSlippage] = useState("");
  const [showSlippageSettings, setShowSlippageSettings] = useState(false);

  const handleSwapDirection = useCallback(() => {
    setInputMint(outputMint);
    setOutputMint(inputMint);
  }, [inputMint, outputMint]);

  const handleSubmit = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) return;
    onReview({ inputMint, outputMint, amount, slippageBps });
  }, [inputMint, outputMint, amount, slippageBps, onReview]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only valid number input
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  };

  const handleCustomSlippage = (val: string) => {
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setCustomSlippage(val);
      const bps = Math.round(parseFloat(val || "0") * 100);
      if (bps > 0 && bps <= 5000) {
        setSlippageBps(bps);
      }
    }
  };

  const inputToken = TOKEN_METADATA[inputMint];
  const outputToken = TOKEN_METADATA[outputMint];

  const isValid = amount && parseFloat(amount) > 0 && inputMint !== outputMint;

  return (
    <div
      className={`glass-card animate-fade-in-up ${isCompact ? "" : ""}`}
      style={{
        padding: isCompact ? "20px 24px" : "28px 32px",
        maxWidth: "560px",
        width: "100%",
        margin: "0 auto",
        transition: "all var(--transition-slow)",
      }}
    >
      {/* You Send Section */}
      <div style={{ marginBottom: "4px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            You send
          </label>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "var(--bg-input)",
            borderRadius: "var(--radius-md)",
            padding: "4px 12px 4px 4px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <select
            id="input-token-select"
            className="select-field"
            value={inputMint}
            onChange={(e) => setInputMint(e.target.value)}
            style={{
              background: "var(--bg-card)",
              border: "none",
              borderRight: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm) 0 0 var(--radius-sm)",
              minWidth: "110px",
            }}
          >
            {SELECTABLE_TOKENS.map((t) => (
              <option key={t.mint} value={t.mint} disabled={t.mint === outputMint}>
                {t.symbol}
              </option>
            ))}
          </select>
          <input
            id="swap-amount-input"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
            className="input-large"
            style={{ flex: 1, textAlign: "right" }}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
        <button
          id="swap-direction-btn"
          onClick={handleSwapDirection}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-accent)";
            e.currentTarget.style.color = "var(--text-accent)";
            e.currentTarget.style.transform = "rotate(180deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.transform = "rotate(0deg)";
          }}
          aria-label="Swap token direction"
        >
          ↕
        </button>
      </div>

      {/* You Receive Section */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            You receive
          </label>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "var(--bg-input)",
            borderRadius: "var(--radius-md)",
            padding: "4px 16px 4px 4px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <select
            id="output-token-select"
            className="select-field"
            value={outputMint}
            onChange={(e) => setOutputMint(e.target.value)}
            style={{
              background: "var(--bg-card)",
              border: "none",
              borderRight: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm) 0 0 var(--radius-sm)",
              minWidth: "110px",
            }}
          >
            {SELECTABLE_TOKENS.map((t) => (
              <option key={t.mint} value={t.mint} disabled={t.mint === inputMint}>
                {t.symbol}
              </option>
            ))}
          </select>
          <div
            style={{
              flex: 1,
              textAlign: "right",
              fontSize: "28px",
              fontWeight: 600,
              color: "var(--text-tertiary)",
              padding: "16px 8px",
              letterSpacing: "-0.02em",
            }}
          >
            —
          </div>
        </div>
      </div>

      {/* Slippage Settings */}
      <div style={{ marginBottom: "20px" }}>
        <button
          id="slippage-toggle-btn"
          onClick={() => setShowSlippageSettings(!showSlippageSettings)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "var(--text-tertiary)",
            fontSize: "12px",
            cursor: "pointer",
            padding: "4px 0",
            transition: "color var(--transition-fast)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
        >
          <span style={{ fontSize: "10px" }}>{showSlippageSettings ? "▾" : "▸"}</span>
          Slippage: {(slippageBps / 100).toFixed(1)}%
        </button>

        {showSlippageSettings && (
          <div
            className="animate-slide-down"
            style={{
              display: "flex",
              gap: "6px",
              marginTop: "8px",
              flexWrap: "wrap",
            }}
          >
            {SLIPPAGE_OPTIONS.map((bps) => (
              <button
                key={bps}
                className={`btn-secondary ${slippageBps === bps && !customSlippage ? "active" : ""}`}
                onClick={() => {
                  setSlippageBps(bps);
                  setCustomSlippage("");
                }}
              >
                {(bps / 100).toFixed(1)}%
              </button>
            ))}
            <input
              type="text"
              inputMode="decimal"
              placeholder="Custom %"
              value={customSlippage}
              onChange={(e) => handleCustomSlippage(e.target.value)}
              className="input-field"
              style={{
                width: "90px",
                padding: "8px 12px",
                fontSize: "13px",
                textAlign: "center",
              }}
            />
          </div>
        )}
      </div>

      {/* Review Button */}
      <button
        id="review-swap-btn"
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        style={{ width: "100%", fontSize: "16px", padding: "16px" }}
      >
        <span>
          {isLoading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin-slow 0.8s linear infinite",
                  display: "inline-block",
                }}
              />
              Fetching Quote...
            </span>
          ) : (
            "Review Swap"
          )}
        </span>
      </button>

      {/* Token preview */}
      {isValid && !isLoading && (
        <div
          className="animate-fade-in"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginTop: "16px",
            fontSize: "13px",
            color: "var(--text-tertiary)",
          }}
        >
          <TokenBadge symbol={inputToken?.symbol || "?"} logoURI={inputToken?.logoURI} size="sm" />
          <span>{amount}</span>
          <span style={{ color: "var(--text-tertiary)" }}>→</span>
          <TokenBadge symbol={outputToken?.symbol || "?"} logoURI={outputToken?.logoURI} size="sm" />
        </div>
      )}
    </div>
  );
}
