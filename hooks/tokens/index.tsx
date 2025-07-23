import { useQuery } from "@tanstack/react-query";

export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  [k: string]: any;
}

const LIST_URL = "https://tokens.uniswap.org";

const POPULAR_TOKENS = [
  "ETH",
  "WETH",
  "USDC",
  "USDT",
  "DAI",
  "WBTC",
  "UNI",
  "LINK",
  "AAVE",
  "COMP",
  "MKR",
  "SNX",
  "CRV",
  "BAL",
  "YFI",
  "SUSHI",
  "1INCH",
  "ENS",
  "LDO",
  "OP",
  "MATIC",
  "BNB",
  "ADA",
  "DOT",
  "AVAX",
  "SOL",
  "ATOM",
  "FTM",
  "NEAR",
];

export function useTokenList() {
  return useQuery<Token[], Error>({
    queryKey: ["tokenList"],
    queryFn: async () => {
      const res = await fetch(LIST_URL);

      if (!res.ok) {
        throw new Error(`Failed to fetch token list: ${res.statusText}`);
      }

      const body = (await res.json()) as { tokens: Token[] };

      const popularTokens = body.tokens.filter((token) =>
        POPULAR_TOKENS.includes(token.symbol.toUpperCase()),
      );

      return popularTokens;
    },
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
