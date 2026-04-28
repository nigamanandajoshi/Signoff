"use client";

import React, { useState } from "react";

interface TokenBadgeProps {
  symbol: string;
  logoURI?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export default function TokenBadge({
  symbol,
  logoURI,
  name,
  size = "md",
  showName = false,
}: TokenBadgeProps) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: { logo: 20, fontSize: 12, gap: 4 },
    md: { logo: 28, fontSize: 14, gap: 6 },
    lg: { logo: 36, fontSize: 16, gap: 8 },
  };

  const s = sizes[size];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${s.gap}px`,
      }}
    >
      {logoURI && !imgError ? (
        <img
          src={logoURI}
          alt={symbol}
          width={s.logo}
          height={s.logo}
          onError={() => setImgError(true)}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid var(--border-subtle)",
          }}
        />
      ) : (
        <div
          className="token-logo-fallback"
          style={{
            width: `${s.logo}px`,
            height: `${s.logo}px`,
            fontSize: `${Math.max(8, s.logo * 0.35)}px`,
          }}
        >
          {symbol.slice(0, 2)}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontWeight: 600,
            fontSize: `${s.fontSize}px`,
            color: "var(--text-primary)",
            lineHeight: 1.2,
          }}
        >
          {symbol}
        </span>
        {showName && name && (
          <span
            style={{
              fontSize: `${Math.max(10, s.fontSize - 2)}px`,
              color: "var(--text-tertiary)",
              lineHeight: 1.2,
            }}
          >
            {name}
          </span>
        )}
      </div>
    </div>
  );
}
