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

      const asset = getAssetErc20ByChainAndSymbol({
        chainId,
        symbol,
        apiKey,
      });

      return asset;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useGetAssetsSimple() {
  return useQuery({
    queryKey: ["tokenList"],
    queryFn: async () => {
      const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY;

      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_FUNKIT_API_KEY is not defined");
      }

      // Process tokens sequentially to avoid rate limiting
      const assets = [];
      for (const token of TOKENS) {
        try {
          console.log(`Fetching ${token.symbol} on chain ${token.chainId}...`);
          const asset = await getAssetErc20ByChainAndSymbol({
            chainId: token.chainId,
            symbol: token.symbol,
            apiKey,
          });
          console.log(`Successfully fetched ${token.symbol}:`, asset);
          assets.push(asset);
        } catch (error) {
          console.error(
            `Failed to fetch asset for ${token.symbol} on chain ${token.chainId}:`,
            error,
          );
        }
      }
      return assets;
    },
    staleTime: 5 * 60_000,
    retry: 1,
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
