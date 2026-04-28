// ─── Jupiter API Types ───

export interface SwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}

export interface RoutePlanStep {
  swapInfo: SwapInfo;
  percent: number;
}

export interface PlatformFee {
  amount: string;
  feeBps: number;
}

export interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: "ExactIn" | "ExactOut";
  slippageBps: number;
  priceImpactPct: string;
  routePlan: RoutePlanStep[];
  platformFee?: PlatformFee;
  contextSlot?: number;
  timeTaken?: number;
}

// ─── Token Types ───

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  tags?: string[];
  verified?: boolean;
}

// ─── Review Types ───

export interface ReviewData {
  quote: QuoteResponse;
  inputToken: TokenInfo;
  outputToken: TokenInfo;
  formattedInAmount: string;
  formattedOutAmount: string;
  formattedMinReceived: string;
  exchangeRate: string;
  priceImpactSeverity: "low" | "medium" | "high";
  routeComplexity: "simple" | "multi-hop" | "complex";
  hops: number;
}

// ─── UI State Types ───

export type AppState = "idle" | "loading" | "review" | "error";

export interface SwapInputState {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps: number;
}

export interface AppError {
  message: string;
  details?: string;
}

// ─── Risk Types ───

export type RiskSeverity = "info" | "warning" | "critical";
export type RiskCategory =
  | "token"
  | "slippage"
  | "price_impact"
  | "route"
  | "value"
  | "depeg";

export interface RiskFlag {
  severity: RiskSeverity;
  title: string;
  description: string;
  category: RiskCategory;
  icon: string;
}

export type OverallRisk = "low" | "medium" | "high";

export interface RiskAssessment {
  flags: RiskFlag[];
  overallRisk: OverallRisk;
  riskScore: number; // 0-100
}

// ─── Approval Brief Types ───

export interface BriefDetail {
  label: string;
  value: string;
}

export interface ApprovalBrief {
  summary: string;
  details: BriefDetail[];
  routeExplanation: string;
  warnings: string[];
  verdict: string;
  verdictSeverity: OverallRisk;
  timestamp: string;
}
