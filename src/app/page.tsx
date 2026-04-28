"use client";

import React, { useState, useCallback } from "react";
import Header from "@/components/Header";
import SwapInput from "@/components/SwapInput";
import ReviewPanel from "@/components/ReviewPanel";
import RiskFlags from "@/components/RiskFlags";
import RouteDisplay from "@/components/RouteDisplay";
import ApprovalBrief from "@/components/ApprovalBrief";
import LoadingState from "@/components/LoadingState";
import { TOKEN_METADATA } from "@/lib/constants";
import { toRawAmount, fromRawAmount, formatAmount } from "@/lib/jupiter";
import { getTokenInfo } from "@/lib/tokens";
import { analyzeRisks } from "@/lib/risks";
import { generateBrief } from "@/lib/brief";
import type {
  AppState,
  QuoteResponse,
  ReviewData,
  TokenInfo,
  AppError,
  RiskAssessment,
  ApprovalBrief as ApprovalBriefType,
} from "@/lib/types";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [approvalBrief, setApprovalBrief] = useState<ApprovalBriefType | null>(null);
  const [error, setError] = useState<AppError | null>(null);

  const handleReview = useCallback(
    async (params: {
      inputMint: string;
      outputMint: string;
      amount: string;
      slippageBps: number;
    }) => {
      setAppState("loading");
      setError(null);
      setReviewData(null);
      setRiskAssessment(null);
      setApprovalBrief(null);

      try {
        // 1. Resolve token metadata
        const inputToken: TokenInfo =
          TOKEN_METADATA[params.inputMint] ||
          (await getTokenInfo(params.inputMint));
        const outputToken: TokenInfo =
          TOKEN_METADATA[params.outputMint] ||
          (await getTokenInfo(params.outputMint));

        // 2. Convert amount to raw units
        const rawAmount = toRawAmount(params.amount, inputToken.decimals);

        // 3. Fetch quote from our API proxy
        const quoteRes = await fetch(
          `/api/quote?inputMint=${params.inputMint}&outputMint=${params.outputMint}&amount=${rawAmount}&slippageBps=${params.slippageBps}`
        );

        if (!quoteRes.ok) {
          const errData = await quoteRes.json().catch(() => ({}));
          throw new Error(
            errData.error || `Failed to fetch quote (${quoteRes.status})`
          );
        }

        const quote: QuoteResponse = await quoteRes.json();

        // 4. Process into ReviewData
        const formattedInAmount = formatAmount(
          fromRawAmount(quote.inAmount, inputToken.decimals)
        );
        const formattedOutAmount = formatAmount(
          fromRawAmount(quote.outAmount, outputToken.decimals)
        );
        const formattedMinReceived = formatAmount(
          fromRawAmount(quote.otherAmountThreshold, outputToken.decimals)
        );

        // Calculate exchange rate
        const inNum = parseFloat(
          fromRawAmount(quote.inAmount, inputToken.decimals)
        );
        const outNum = parseFloat(
          fromRawAmount(quote.outAmount, outputToken.decimals)
        );
        const rate = inNum > 0 ? outNum / inNum : 0;
        const exchangeRate = `1 ${inputToken.symbol} ≈ ${formatAmount(rate.toString())} ${outputToken.symbol}`;

        // Price impact severity
        const priceImpact = parseFloat(quote.priceImpactPct);
        const priceImpactSeverity =
          priceImpact < 1 ? "low" : priceImpact < 3 ? "medium" : "high";

        // Route complexity
        const hops = quote.routePlan.length;
        const routeComplexity =
          hops === 1 ? "simple" : hops <= 3 ? "multi-hop" : "complex";

        const data: ReviewData = {
          quote,
          inputToken,
          outputToken,
          formattedInAmount,
          formattedOutAmount,
          formattedMinReceived,
          exchangeRate,
          priceImpactSeverity,
          routeComplexity,
          hops,
        };

        // 5. Run risk analysis
        const risks = analyzeRisks(data);

        // 6. Generate approval brief
        const brief = generateBrief(data, risks);

        setReviewData(data);
        setRiskAssessment(risks);
        setApprovalBrief(brief);
        setAppState("review");
      } catch (err) {
        console.error("Review error:", err);
        setError({
          message:
            err instanceof Error ? err.message : "Failed to fetch swap quote",
          details:
            err instanceof Error ? err.stack : undefined,
        });
        setAppState("error");
      }
    },
    []
  );

  const handleReset = useCallback(() => {
    setAppState("idle");
    setReviewData(null);
    setRiskAssessment(null);
    setApprovalBrief(null);
    setError(null);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px 60px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Header />

      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          marginTop: appState === "idle" ? "60px" : "24px",
          transition: "margin-top var(--transition-slow)",
        }}
      >
        {/* Swap Input */}
        <SwapInput
          onReview={handleReview}
          isLoading={appState === "loading"}
          isCompact={appState === "review"}
        />

        {/* Loading State */}
        {appState === "loading" && <LoadingState />}

        {/* Error State */}
        {appState === "error" && error && (
          <div
            className="glass-card-static animate-fade-in-up"
            style={{
              padding: "24px 32px",
              maxWidth: "560px",
              width: "100%",
              margin: "24px auto 0",
              borderColor: "rgba(248, 113, 113, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>⚠</span>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#f87171",
                }}
              >
                Quote Error
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {error.message}
            </p>
            <button
              id="try-again-btn"
              className="btn-secondary"
              onClick={handleReset}
              style={{ marginTop: "16px" }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Review Results */}
        {appState === "review" && reviewData && (
          <>
            <ReviewPanel
              data={reviewData}
              overallRisk={riskAssessment?.overallRisk}
            />

            {riskAssessment && <RiskFlags assessment={riskAssessment} />}

            <RouteDisplay data={reviewData} />

            {approvalBrief && <ApprovalBrief brief={approvalBrief} />}

            {/* Reset button */}
            <div
              className="animate-fade-in-up animate-delay-4"
              style={{
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              <button
                id="new-review-btn"
                className="btn-secondary"
                onClick={handleReset}
                style={{ padding: "10px 24px" }}
              >
                ← New Review
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "auto",
          paddingTop: "60px",
          textAlign: "center",
          fontSize: "12px",
          color: "var(--text-tertiary)",
        }}
      >
        <p>
          Signoff — non-custodial · read-first · human-in-the-loop
        </p>
        <p style={{ marginTop: "4px", opacity: 0.6 }}>
          Frontier MVP · Not financial advice
        </p>
      </footer>
    </main>
  );
}
