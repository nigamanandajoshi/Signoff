import { JUPITER_QUOTE_URL } from "./constants";
import { QuoteResponse } from "./types";

interface GetQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: string; // raw lamport/smallest-unit amount
  slippageBps?: number;
}

/**
 * Fetch a swap quote from Jupiter API.
 * Uses keyless access (0.5 req/s rate limit — fine for MVP).
 */
export async function getQuote(params: GetQuoteParams): Promise<QuoteResponse> {
  const { inputMint, outputMint, amount, slippageBps = 50 } = params;

  const url = new URL(JUPITER_QUOTE_URL);
  url.searchParams.set("inputMint", inputMint);
  url.searchParams.set("outputMint", outputMint);
  url.searchParams.set("amount", amount);
  url.searchParams.set("slippageBps", slippageBps.toString());
  url.searchParams.set("swapMode", "ExactIn");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Jupiter API error (${response.status}): ${errorBody || response.statusText}`
    );
  }

  const data: QuoteResponse = await response.json();
  return data;
}

/**
 * Convert a human-readable amount to raw amount (smallest unit).
 * e.g., 1.5 SOL (9 decimals) → "1500000000"
 */
export function toRawAmount(amount: string, decimals: number): string {
  const str = String(amount ?? "0");
  const parts = str.split(".");
  const whole = parts[0] || "0";
  const fraction = (parts[1] || "").padEnd(decimals, "0").slice(0, decimals);
  const raw = whole + fraction;
  // Remove leading zeros but keep at least "0"
  return raw.replace(/^0+/, "") || "0";
}

/**
 * Convert raw amount (smallest unit) to human-readable amount.
 * e.g., "1500000000" (9 decimals) → "1.5"
 */
export function fromRawAmount(rawAmount: string, decimals: number): string {
  const safe = String(rawAmount ?? "0");
  const padded = safe.padStart(decimals + 1, "0");
  const whole = padded.slice(0, padded.length - decimals);
  const fraction = padded.slice(padded.length - decimals);
  const trimmedFraction = fraction.replace(/0+$/, "");
  if (trimmedFraction) {
    return `${whole}.${trimmedFraction}`;
  }
  return whole;
}

/**
 * Format a number string with commas for display.
 * e.g., "15234.56" → "15,234.56"
 */
export function formatAmount(amount: string, maxDecimals: number = 6): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return "0";

  // For very small numbers, show more decimals
  if (num > 0 && num < 0.001) {
    return num.toFixed(maxDecimals);
  }

  // For larger numbers, show fewer decimals
  const decimals = num >= 1000 ? 2 : num >= 1 ? 4 : maxDecimals;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}
