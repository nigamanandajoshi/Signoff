import { ReviewData, RiskAssessment, ApprovalBrief, BriefDetail } from "./types";

/**
 * Generate a plain-English approval brief from the review data and risk assessment.
 * Designed to be human-readable and screenshot-friendly.
 */
export function generateBrief(
  data: ReviewData,
  risks: RiskAssessment
): ApprovalBrief {
  const {
    inputToken,
    outputToken,
    formattedInAmount,
    formattedOutAmount,
    formattedMinReceived,
    exchangeRate,
    hops,
    quote,
  } = data;

  // ─── Summary ───
  const routeType =
    hops === 1 ? "direct swap" : `${hops}-hop route`;
  const summary = `You are swapping ${formattedInAmount} ${inputToken.symbol} for approximately ${formattedOutAmount} ${outputToken.symbol} via a ${routeType} on Jupiter.`;

  // ─── Details ───
  const details: BriefDetail[] = [
    { label: "You send", value: `${formattedInAmount} ${inputToken.symbol}` },
    {
      label: "You receive (estimated)",
      value: `${formattedOutAmount} ${outputToken.symbol}`,
    },
    {
      label: "Minimum received",
      value: `${formattedMinReceived} ${outputToken.symbol}`,
    },
    { label: "Exchange rate", value: exchangeRate },
    {
      label: "Slippage tolerance",
      value: `${(quote.slippageBps / 100).toFixed(1)}%`,
    },
    {
      label: "Price impact",
      value: formatPriceImpact(parseFloat(quote.priceImpactPct)),
    },
    { label: "Route", value: `${hops} ${hops === 1 ? "hop" : "hops"} (${data.routeComplexity})` },
  ];

  // ─── Route Explanation ───
  const dexLabels = [
    ...new Set(quote.routePlan.map((step) => step.swapInfo.label)),
  ];
  const routeExplanation = generateRouteExplanation(
    hops,
    dexLabels,
    inputToken.symbol,
    outputToken.symbol
  );

  // ─── Warnings ───
  const warnings = risks.flags
    .filter((f) => f.severity !== "info")
    .map((f) => `${f.icon} ${f.title}: ${f.description}`);

  // ─── Verdict ───
  const verdict = generateVerdict(data, risks);

  return {
    summary,
    details,
    routeExplanation,
    warnings,
    verdict,
    verdictSeverity: risks.overallRisk,
    timestamp: new Date().toISOString(),
  };
}

// ─── Helpers ───

function formatPriceImpact(impact: number): string {
  if (impact < 0.01) return "Negligible (< 0.01%)";
  if (impact < 0.1) return `Very low (${impact.toFixed(3)}%)`;
  if (impact < 1) return `Low (${impact.toFixed(2)}%)`;
  if (impact < 3) return `Moderate (${impact.toFixed(2)}%)`;
  if (impact < 5) return `High (${impact.toFixed(2)}%)`;
  return `Very high (${impact.toFixed(2)}%)`;
}

function generateRouteExplanation(
  hops: number,
  dexLabels: string[],
  inputSymbol: string,
  outputSymbol: string
): string {
  if (hops === 1) {
    return `Your ${inputSymbol} → ${outputSymbol} swap executes directly on ${dexLabels[0]}. This is the simplest route with a single exchange step.`;
  }

  const dexList = formatList(dexLabels);
  return `Your swap routes through ${dexList} in ${hops} steps to find the best rate for ${inputSymbol} → ${outputSymbol}. Multi-hop routing is a standard Jupiter optimization that can provide better pricing than a single pool.`;
}

function generateVerdict(data: ReviewData, risks: RiskAssessment): string {
  const { overallRisk, flags } = risks;
  const criticalCount = flags.filter((f) => f.severity === "critical").length;
  const warningCount = flags.filter((f) => f.severity === "warning").length;

  if (overallRisk === "low" && flags.length === 0) {
    return "This swap appears straightforward with no risk signals detected. Review the details above and sign when ready.";
  }

  if (overallRisk === "low") {
    return "This swap has minor informational notes but no significant risk signals. Review the route details and proceed when satisfied.";
  }

  if (overallRisk === "medium") {
    return `This swap has ${warningCount} ${warningCount === 1 ? "warning" : "warnings"} worth reviewing. Check the flagged items above before signing. None are blocking, but they may affect your expected outcome.`;
  }

  // high risk
  return `This swap has ${criticalCount} critical ${criticalCount === 1 ? "concern" : "concerns"}. Carefully review the warnings above before proceeding. Consider adjusting your swap parameters or splitting into smaller trades.`;
}

function formatList(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * Convert an ApprovalBrief to a plain-text string for clipboard copy.
 */
export function briefToText(brief: ApprovalBrief): string {
  const lines: string[] = [];

  lines.push("═══ SIGNOFF APPROVAL BRIEF ═══");
  lines.push("");
  lines.push(brief.summary);
  lines.push("");
  lines.push("── Details ──");
  for (const detail of brief.details) {
    lines.push(`  ${detail.label}: ${detail.value}`);
  }
  lines.push("");
  lines.push("── Route ──");
  lines.push(`  ${brief.routeExplanation}`);

  if (brief.warnings.length > 0) {
    lines.push("");
    lines.push("── Warnings ──");
    for (const w of brief.warnings) {
      lines.push(`  ${w}`);
    }
  }

  lines.push("");
  lines.push("── Verdict ──");
  lines.push(`  ${brief.verdict}`);
  lines.push("");
  lines.push(`Generated by Signoff · ${new Date(brief.timestamp).toLocaleString()}`);
  lines.push("═══════════════════════════════");

  return lines.join("\n");
}
