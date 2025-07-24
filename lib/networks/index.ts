export interface BlockchainNetwork {
  chain: string;
  icon: string;
  name: string;
  symbol: string;
}

export const NETWORKS: BlockchainNetwork[] = [
  { chain: "1", icon: "ethereum", name: "Ethereum", symbol: "ETH" },
  { chain: "10", icon: "optimism", name: "Optimism", symbol: "OP" },
  { chain: "137", icon: "polygon", name: "Polygon", symbol: "MATIC" },
  { chain: "324", icon: "zksync", name: "ZKsync", symbol: "ZKS" },
  { chain: "8453", icon: "base", name: "Base", symbol: "BASE" },
  { chain: "42161", icon: "arbitrum", name: "Arbitrum", symbol: "ARB" },
  { chain: "43114", icon: "avalanchec", name: "Avalanche", symbol: "AVAX" },
];
