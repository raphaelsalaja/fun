import { useQuery } from "@tanstack/react-query";
import tokenList from "@uniswap/default-token-list";

export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  [k: string]: unknown;
}

export interface Network {
  chainId: number;
  tokens: Token[];
}

export function useTokenList() {
  return useQuery<Network[], Error>({
    queryKey: ["tokenList"],
    queryFn: async () => {
      const list = tokenList.tokens;

      const groupedTokens: Record<number, Token[]> = {};
      list.forEach((token) => {
        if (!groupedTokens[token.chainId]) {
          groupedTokens[token.chainId] = [];
        }
        groupedTokens[token.chainId].push(token);
      });

      const networks: Network[] = Object.entries(groupedTokens).map(
        ([chainId, tokens]) => ({
          chainId: parseInt(chainId, 10),
          tokens,
        }),
      );

      return networks;
    },
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
