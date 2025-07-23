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

export function useTokenList() {
  return useQuery<Token[], Error>({
    queryKey: ["tokenList"],
    queryFn: async () => {
      const res = await fetch(LIST_URL);

      if (!res.ok) {
        throw new Error(`Failed to fetch token list: ${res.statusText}`);
      }

      const body = (await res.json()) as { tokens: Token[] };

      return body.tokens;
    },
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
