import { TokenInfo } from "./types";

// ─── Jupiter API ───

export const JUPITER_API_BASE = "https://api.jup.ag";
export const JUPITER_QUOTE_URL = `${JUPITER_API_BASE}/swap/v1/quote`;
export const JUPITER_TOKENS_URL = `${JUPITER_API_BASE}/tokens/v2`;

// ─── Default Settings ───

export const DEFAULT_SLIPPAGE_BPS = 50; // 0.5%
export const SLIPPAGE_OPTIONS = [10, 50, 100]; // 0.1%, 0.5%, 1.0%

// ─── Token Mint Addresses (Solana Mainnet) ───

export const TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  RAY: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
} as const;

// ─── Hardcoded Token Metadata (fallback) ───

export const TOKEN_METADATA: Record<string, TokenInfo> = {
  [TOKENS.SOL]: {
    address: TOKENS.SOL,
    name: "Wrapped SOL",
    symbol: "SOL",
    decimals: 9,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    verified: true,
  },
  [TOKENS.USDC]: {
    address: TOKENS.USDC,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    verified: true,
  },
  [TOKENS.USDT]: {
    address: TOKENS.USDT,
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    verified: true,
  },
  [TOKENS.JUP]: {
    address: TOKENS.JUP,
    name: "Jupiter",
    symbol: "JUP",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png",
    verified: true,
  },
  [TOKENS.BONK]: {
    address: TOKENS.BONK,
    name: "Bonk",
    symbol: "BONK",
    decimals: 5,
    logoURI: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    verified: true,
  },
  [TOKENS.RAY]: {
    address: TOKENS.RAY,
    name: "Raydium",
    symbol: "RAY",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png",
    verified: true,
  },
};

// ─── Selectable Token List (for dropdowns) ───

export const SELECTABLE_TOKENS = [
  { mint: TOKENS.SOL, symbol: "SOL", name: "Wrapped SOL" },
  { mint: TOKENS.USDC, symbol: "USDC", name: "USD Coin" },
  { mint: TOKENS.USDT, symbol: "USDT", name: "Tether USD" },
  { mint: TOKENS.JUP, symbol: "JUP", name: "Jupiter" },
  { mint: TOKENS.BONK, symbol: "BONK", name: "Bonk" },
  { mint: TOKENS.RAY, symbol: "RAY", name: "Raydium" },
];

// ─── DEX Labels & Colors ───

export const DEX_COLORS: Record<string, string> = {
  "Raydium": "#7B61FF",
  "Raydium CLMM": "#7B61FF",
  "Raydium CP": "#7B61FF",
  "Orca": "#FFD700",
  "Orca (Whirlpools)": "#FFD700",
  "Meteora": "#00D1FF",
  "Meteora DLMM": "#00D1FF",
  "Phoenix": "#FF6B35",
  "Lifinity": "#42E695",
  "Lifinity V2": "#42E695",
  "OpenBook": "#F472B6",
  "Saber": "#6366F1",
};

export const DEFAULT_DEX_COLOR = "#64748b";
