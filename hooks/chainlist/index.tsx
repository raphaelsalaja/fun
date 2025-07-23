import { useQuery } from "@tanstack/react-query";

interface ChainInfo {
  chainId: number;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export function useGetChainListAssets() {
  return useQuery<{ chainId: string; symbol: string }[]>({
    queryKey: ["chainListNativeAssets"],
    queryFn: async () => {
      const res = await fetch("https://chainlist.org/rpcs.json");
      if (!res.ok) {
        throw new Error("Failed to fetch Chainlist data");
      }
      const data: ChainInfo[] = await res.json();
      return data
        .filter(
          (c) => typeof c.chainId === "number" && c.nativeCurrency?.symbol,
        )
        .map((c) => ({
          chainId: String(c.chainId),
          symbol: c.nativeCurrency?.symbol,
        }))
        .slice(0, 10);
    },
    staleTime: 5 * 60_000, // 5 minutes
    retry: 1,
  });
}
