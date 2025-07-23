"use client";

import { getAssetPriceInfo } from "@funkit/api-base";
import { useQuery } from "@tanstack/react-query";

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
