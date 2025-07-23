"use client";

import {
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";
import { useQuery } from "@tanstack/react-query";
import { useTokenList } from "@/hooks/tokens";
import { TOKENS } from "@/lib/tokens";

interface ApiError {
  message: string;
  status?: number;
}

const createApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "An unknown error occurred" };
};

export function useGetAsset(chainId: string, symbol: string) {
  return useQuery({
    queryKey: ["tokenInfo", chainId, symbol],
    queryFn: async () => {
      const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY;
      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_FUNKIT_API_KEY is not defined");
      }

      try {
        const asset = await getAssetErc20ByChainAndSymbol({
          chainId,
          symbol,
          apiKey,
        });
        return asset;
      } catch (error) {
        throw createApiError(error);
      }
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("API_KEY")) {
        return false;
      }
      return failureCount < 3;
    },
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

      const assets = [];
      const errors: string[] = [];

      for (const token of TOKENS) {
        try {
          const asset = await getAssetErc20ByChainAndSymbol({
            chainId: token.chainId,
            symbol: token.symbol,
            apiKey,
          });
          assets.push(asset);
        } catch (error) {
          const errorMessage = `Failed to fetch ${token.symbol} on chain ${token.chainId}`;
          console.error(errorMessage, error);
          errors.push(errorMessage);
        }
      }

      if (assets.length === 0) {
        throw new Error("Failed to fetch any token data");
      }

      if (errors.length > 0) {
        console.warn("Partial failures in token fetching:", errors);
      }

      return assets;
    },
    staleTime: 5 * 60_000,
    retry: 2,
  });
}

export function useGetAssets() {
  const {
    data: tokenList,
    isLoading: isTokenListLoading,
    error: tokenListError,
  } = useTokenList();

  return useQuery({
    queryKey: ["assetsFromTokenList"],
    queryFn: async () => {
      const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY;

      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_FUNKIT_API_KEY is not defined");
      }

      if (!tokenList) {
        throw new Error("Token list not available");
      }

      const assets = [];
      const errors: string[] = [];

      for (const token of tokenList) {
        try {
          const asset = await getAssetErc20ByChainAndSymbol({
            chainId: token.chainId.toString(),
            symbol: token.symbol,
            apiKey,
          });
          assets.push(asset);
        } catch (error) {
          const errorMessage = `Failed to fetch ${token.symbol} on chain ${token.chainId}`;
          console.error(errorMessage, error);
          errors.push(errorMessage);
        }
      }

      if (assets.length === 0) {
        throw new Error("Failed to fetch any token data");
      }

      if (errors.length > 0) {
        console.warn("Partial failures in token fetching:", errors);
      }

      return assets;
    },
    enabled: Boolean(tokenList && !isTokenListLoading && !tokenListError),
    staleTime: 5 * 60_000,
    retry: 2,
  });
}

export function useGetAssetPriceInfo(chainId?: string, address?: string) {
  return useQuery({
    queryKey: ["tokenPrice", chainId, address],
    queryFn: async () => {
      const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY;
      if (!apiKey || !chainId || !address) {
        throw new Error("Missing required parameters for price info");
      }

      try {
        return await getAssetPriceInfo({
          chainId,
          assetTokenAddress: address,
          apiKey,
        });
      } catch (error) {
        throw createApiError(error);
      }
    },
    enabled: Boolean(chainId && address),
    staleTime: 15_000,
    retry: (failureCount, error) => {
      if (error instanceof Error) {
        if (
          error.message.includes("API_KEY") ||
          error.message.includes("Missing required")
        ) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
}
