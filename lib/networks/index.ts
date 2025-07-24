export interface BlockchainNetwork {
  chainId: string;
  icon: string;
  name: string;
}

export const NETWORKS: BlockchainNetwork[] = [
  { chainId: "1", icon: "ethereum", name: "Ethereum" },
  { chainId: "10", icon: "optimism", name: "Optimism" },
  { chainId: "56", icon: "smartchain", name: "BNB Chain" },
  { chainId: "137", icon: "polygon", name: "Polygon" },
  { chainId: "238", icon: "blast", name: "Blast" },
  { chainId: "324", icon: "zksync", name: "ZKsync" },
  { chainId: "8453", icon: "base", name: "Base" },
  { chainId: "42161", icon: "arbitrum", name: "Arbitrum" },
  { chainId: "43114", icon: "avalanchec", name: "Avalanche" },
  { chainId: "42220", icon: "celo", name: "Celo" },
  { chainId: "7777777", icon: "zora", name: "Zora" },
];

// rejig the networks to use these
// fix animations
// ship off
