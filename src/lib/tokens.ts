import { JUPITER_TOKENS_URL, TOKEN_METADATA } from "./constants";
import { TokenInfo } from "./types";

// In-memory cache for token metadata lookups
const tokenCache = new Map<string, TokenInfo>();

// Pre-populate cache with hardcoded tokens
Object.entries(TOKEN_METADATA).forEach(([address, info]) => {
  tokenCache.set(address, info);
});

/**
 * Get token metadata by mint address.
 * Checks local cache first, then falls back to Jupiter Tokens API.
 */
export async function getTokenInfo(mintAddress: string): Promise<TokenInfo> {
  // Check cache first
  const cached = tokenCache.get(mintAddress);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${JUPITER_TOKENS_URL}/search?query=${mintAddress}`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (response.ok) {
      const tokens = await response.json();

      // The search endpoint returns an array; find exact mint match
      const match = Array.isArray(tokens)
        ? tokens.find(
            (t: Record<string, unknown>) => t.address === mintAddress
          )
        : tokens.address === mintAddress
          ? tokens
          : null;

      if (match) {
        const tokenInfo: TokenInfo = {
          address: match.address,
          name: match.name || "Unknown Token",
          symbol: match.symbol || mintAddress.slice(0, 6),
          decimals: match.decimals ?? 9,
          logoURI: match.logoURI || "",
          verified: match.tags?.includes("verified") ?? false,
        };
        tokenCache.set(mintAddress, tokenInfo);
        return tokenInfo;
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch token info for ${mintAddress}:`, error);
  }

  // Fallback for unknown tokens
  const fallback: TokenInfo = {
    address: mintAddress,
    name: "Unknown Token",
    symbol: mintAddress.slice(0, 6) + "...",
    decimals: 9,
    logoURI: "",
    verified: false,
  };
  tokenCache.set(mintAddress, fallback);
  return fallback;
}

/**
 * Get token metadata for multiple mint addresses at once.
 */
export async function getTokenInfoBatch(
  mintAddresses: string[]
): Promise<Map<string, TokenInfo>> {
  const results = new Map<string, TokenInfo>();
  const uncached: string[] = [];

  // Separate cached from uncached
  for (const mint of mintAddresses) {
    const cached = tokenCache.get(mint);
    if (cached) {
      results.set(mint, cached);
    } else {
      uncached.push(mint);
    }
  }

  // Fetch uncached tokens in parallel
  if (uncached.length > 0) {
    const promises = uncached.map((mint) => getTokenInfo(mint));
    const fetched = await Promise.allSettled(promises);

    fetched.forEach((result, i) => {
      if (result.status === "fulfilled") {
        results.set(uncached[i], result.value);
      }
    });
  }

  return results;
}
