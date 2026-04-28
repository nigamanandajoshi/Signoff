import { NextRequest, NextResponse } from "next/server";
import { getTokenInfo } from "@/lib/tokens";

export async function GET(request: NextRequest) {
  const mint = request.nextUrl.searchParams.get("mint");

  if (!mint) {
    return NextResponse.json(
      { error: "Missing required parameter: mint" },
      { status: 400 }
    );
  }

  try {
    const tokenInfo = await getTokenInfo(mint);
    return NextResponse.json(tokenInfo);
  } catch (error) {
    console.error("Token fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch token metadata" },
      { status: 500 }
    );
  }
}
