import { ReviewData, RiskFlag, RiskAssessment, OverallRisk } from "./types";
import { DEX_COLORS } from "./constants";

/**
 * Analyze a swap quote for risk signals.
 * Returns an array of risk flags and an overall risk assessment.
 */
export function analyzeRisks(data: ReviewData): RiskAssessment {
  const flags: RiskFlag[] = [];

  // 1. Unverified token check
  checkUnverifiedTokens(data, flags);

  // 2. High slippage tolerance
  checkHighSlippage(data, flags);

  // 3. High price impact
  checkPriceImpact(data, flags);

  // 4. Route complexity
  checkRouteComplexity(data, flags);

  // 5. Split route (parallel paths)
  checkSplitRoute(data, flags);

  // 6. Unknown DEX
  checkUnknownDex(data, flags);

  // 7. Large value trade
  checkLargeValue(data, flags);

  // 8. Stablecoin depeg risk
  checkStablecoinDepeg(data, flags);

  // Calculate overall risk
  const overallRisk = calculateOverallRisk(flags);
  const riskScore = calculateRiskScore(flags);

  return { flags, overallRisk, riskScore };
}

// ─── Individual Risk Checks ───

function checkUnverifiedTokens(data: ReviewData, flags: RiskFlag[]) {
  const { inputToken, outputToken } = data;

  if (!inputToken.verified) {
    flags.push({
      severity: "warning",
      title: "Unverified input token",
      description: `${inputToken.symbol} (${inputToken.address.slice(0, 8)}...) is not verified on Jupiter. This token may be a scam, impersonation, or low-quality asset. Verify the mint address before proceeding.`,
      category: "token",
      icon: "⚠",
    });
  }

  if (!outputToken.verified) {
    flags.push({
      severity: "warning",
      title: "Unverified output token",
      description: `${outputToken.symbol} (${outputToken.address.slice(0, 8)}...) is not verified on Jupiter. Ensure this is the correct token by checking the mint address.`,
      category: "token",
      icon: "⚠",
    });
  }
}

function checkHighSlippage(data: ReviewData, flags: RiskFlag[]) {
  const slippagePct = data.quote.slippageBps / 100;

  if (slippagePct >= 3) {
    flags.push({
      severity: "critical",
      title: "Very high slippage tolerance",
      description: `Your slippage tolerance is set to ${slippagePct}%. This means you could receive up to ${slippagePct}% less than the quoted amount. Consider lowering this to 0.5-1% for most swaps.`,
      category: "slippage",
      icon: "🔴",
    });
  } else if (slippagePct >= 1) {
    flags.push({
      severity: "warning",
      title: "Elevated slippage tolerance",
      description: `Your slippage tolerance is ${slippagePct}%. While sometimes necessary for volatile tokens, this means you may receive less than expected. The default of 0.5% is safer for most swaps.`,
      category: "slippage",
      icon: "⚡",
    });
  }
}

function checkPriceImpact(data: ReviewData, flags: RiskFlag[]) {
  const priceImpact = parseFloat(data.quote.priceImpactPct);

  if (priceImpact >= 5) {
    flags.push({
      severity: "critical",
      title: "Severe price impact",
      description: `This swap has a ${priceImpact.toFixed(2)}% price impact, meaning the trade size significantly moves the market price against you. Consider splitting into smaller trades.`,
      category: "price_impact",
      icon: "🔴",
    });
  } else if (priceImpact >= 1) {
    flags.push({
      severity: "warning",
      title: "Notable price impact",
      description: `This swap has a ${priceImpact.toFixed(2)}% price impact. You are receiving a slightly worse rate due to the size of this trade relative to the available liquidity.`,
      category: "price_impact",
      icon: "📊",
    });
  }
}

function checkRouteComplexity(data: ReviewData, flags: RiskFlag[]) {
  const hops = data.hops;

  if (hops >= 4) {
    flags.push({
      severity: "warning",
      title: "Complex route",
      description: `This swap routes through ${hops} steps. Complex routes may have higher cumulative fees and more points of failure. Each hop adds execution risk.`,
      category: "route",
      icon: "🔀",
    });
  } else if (hops >= 3) {
    flags.push({
      severity: "info",
      title: "Multi-hop route",
      description: `This swap uses ${hops} hops. This is common for finding the best rate but adds minor complexity compared to a direct swap.`,
      category: "route",
      icon: "🔗",
    });
  }
}

function checkSplitRoute(data: ReviewData, flags: RiskFlag[]) {
  const hasSplit = data.quote.routePlan.some((step) => step.percent < 100);

  if (hasSplit) {
    const splits = data.quote.routePlan
      .filter((step) => step.percent < 100)
      .map((step) => `${step.percent}% via ${step.swapInfo.label}`)
      .join(", ");

    flags.push({
      severity: "info",
      title: "Split route",
      description: `Your trade is split across multiple paths (${splits}) to achieve the best rate. This is a normal Jupiter optimization.`,
      category: "route",
      icon: "🔀",
    });
  }
}

function checkUnknownDex(data: ReviewData, flags: RiskFlag[]) {
  const unknownDexes = data.quote.routePlan
    .map((step) => step.swapInfo.label)
    .filter((label) => !DEX_COLORS[label]);

  if (unknownDexes.length > 0) {
    const unique = [...new Set(unknownDexes)];
    flags.push({
      severity: "info",
      title: "Less common DEX",
      description: `This route uses ${unique.join(", ")} — ${unique.length === 1 ? "a DEX" : "DEXes"} that may be less established. Jupiter vets its integrated DEXes, but exercise caution with unfamiliar protocols.`,
      category: "route",
      icon: "🏪",
    });
  }
}

function checkLargeValue(data: ReviewData, flags: RiskFlag[]) {
  // Check if input is SOL and amount is large
  const { inputToken, quote } = data;
  const inAmount = parseFloat(data.formattedInAmount.replace(/,/g, ""));

  // Rough heuristic: > 100 SOL or > 10,000 USDC
  const isLargeSOL = inputToken.symbol === "SOL" && inAmount > 100;
  const isLargeStable =
    ["USDC", "USDT"].includes(inputToken.symbol) && inAmount > 10000;

  if (isLargeSOL || isLargeStable) {
    flags.push({
      severity: "warning",
      title: "Large value trade",
      description: `You are swapping ${data.formattedInAmount} ${inputToken.symbol}. For high-value trades, double-check the route, recipient, and consider splitting into smaller transactions.`,
      category: "value",
      icon: "💰",
    });
  }
}

function checkStablecoinDepeg(data: ReviewData, flags: RiskFlag[]) {
  const { inputToken, outputToken, quote } = data;

  const stablecoins = ["USDC", "USDT"];
  const bothStable =
    stablecoins.includes(inputToken.symbol) &&
    stablecoins.includes(outputToken.symbol);

  if (bothStable) {
    const inAmount = parseFloat(
      String(quote.inAmount)
    ) / Math.pow(10, inputToken.decimals);
    const outAmount = parseFloat(
      String(quote.outAmount)
    ) / Math.pow(10, outputToken.decimals);

    if (inAmount > 0) {
      const ratio = outAmount / inAmount;
      const deviation = Math.abs(1 - ratio) * 100;

      if (deviation > 2) {
        flags.push({
          severity: "critical",
          title: "Potential stablecoin depeg",
          description: `The exchange rate between ${inputToken.symbol} and ${outputToken.symbol} deviates ${deviation.toFixed(1)}% from the expected 1:1 peg. This may indicate a depeg event or liquidity issue.`,
          category: "depeg",
          icon: "🔻",
        });
      }
    }
  }
}

// ─── Risk Scoring ───

function calculateOverallRisk(flags: RiskFlag[]): OverallRisk {
  if (flags.some((f) => f.severity === "critical")) return "high";
  if (flags.some((f) => f.severity === "warning")) return "medium";
  return "low";
}

function calculateRiskScore(flags: RiskFlag[]): number {
  let score = 0;
  for (const flag of flags) {
    switch (flag.severity) {
      case "critical":
        score += 35;
        break;
      case "warning":
        score += 15;
        break;
      case "info":
        score += 5;
        break;
    }
  }
  return Math.min(100, score);
}
