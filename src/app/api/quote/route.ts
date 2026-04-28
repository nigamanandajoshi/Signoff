import { NextRequest, NextResponse } from "next/server";
import { JUPITER_QUOTE_URL } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const inputMint = searchParams.get("inputMint");
  const outputMint = searchParams.get("outputMint");
  const amount = searchParams.get("amount");
  const slippageBps = searchParams.get("slippageBps") || "50";

  if (!inputMint || !outputMint || !amount) {
    return NextResponse.json(
      { error: "Missing required parameters: inputMint, outputMint, amount" },
      { status: 400 }
    );
  }

  if (amount === "0" || isNaN(Number(amount))) {
    return NextResponse.json(
      { error: "Invalid amount" },
      { status: 400 }
    );
  }

  try {
    const url = new URL(JUPITER_QUOTE_URL);
    url.searchParams.set("inputMint", inputMint);
    url.searchParams.set("outputMint", outputMint);
    url.searchParams.set("amount", amount);
    url.searchParams.set("slippageBps", slippageBps);
    url.searchParams.set("swapMode", "ExactIn");

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return NextResponse.json(
        { error: `Jupiter API error: ${errorText || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Quote fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote from Jupiter" },
      { status: 500 }
    );
  }
}
