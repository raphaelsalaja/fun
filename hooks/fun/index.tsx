"use client";

import {
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";
import { useQuery } from "@tanstack/react-query";
import { TOKENS } from "@/lib/tokens";

export function useGetAsset(chainId: string, symbol: string) {
  return useQuery({
    queryKey: ["tokenInfo", chainId, symbol],
    queryFn: () => {
      const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY;
      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_FUNKIT_API_KEY is not defined");
      }
      return getAssetErc20ByChainAndSymbol({
        chainId,
        symbol,
        apiKey,
      });
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useGetAssetsSimple() {
  return useQuery({
    queryKey: ["tokenList"],
    queryFn: () => {
      const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY;
      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_FUNKIT_API_KEY is not defined");
      }
      return Promise.all(
        TOKENS.map((token) => {
          return getAssetErc20ByChainAndSymbol({
            chainId: token.chainId,
            symbol: token.symbol,
            apiKey,
          });
        }),
      );
    },
  });
}

export function useGetAssetPriceInfo(chainId?: string, address?: string) {
  return useQuery({
    queryKey: ["tokenPrice", chainId, address],
    queryFn: () => {
      const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY;
      if (!apiKey || !chainId || !address) {
        throw new Error("Missing required parameters");
      }
      return getAssetPriceInfo({
        chainId,
        assetTokenAddress: address,
        apiKey,
      });
    },
    enabled: Boolean(chainId && address),
    staleTime: 15_000,
    retry: 2,
  });
}
