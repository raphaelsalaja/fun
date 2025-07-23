import { Network } from "ethers";

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Goerli",
  10: "Optimism",
  42: "Kovan",
  56: "BNB Chain",
  130: "fastnet",
  137: "Polygon",
  324: "zkSync Era",
  480: "Worldchain",
  1868: "iExec Sidechain",
  8453: "Base",
  42161: "Arbitrum",
  42220: "Celo",
  43114: "Avalanche",
  80001: "Mumbai",
  81457: "Blast",
  7777777: "Zora",
  11155111: "Sepolia",
};

const CHAIN_REPRESENTATIVE_TOKENS: Record<number, string> = {
  1: "eth",
  3: "eth",
  4: "eth",
  5: "eth",
  10: "op",
  42: "eth",
  56: "bnb",
  130: "fastnet",
  137: "matic",
  324: "eth",
  480: "wld",
  1868: "rlc",
  8453: "eth",
  42161: "arb",
  42220: "celo",
  43114: "avax",
  80001: "matic",
  81457: "blast",
  7777777: "zora",
  11155111: "eth",
};

export function getNetworkName(chainId: number): string {
  if (CHAIN_NAMES[chainId]) {
    return CHAIN_NAMES[chainId];
  }

  try {
    const net = Network.from(chainId);
    return net.name === "homestead"
      ? "Ethereum Mainnet"
      : net.name.charAt(0).toUpperCase() + net.name.slice(1);
  } catch {
    return `Chain ${chainId}`;
  }
}

export function getChainIcon(chainId: number): string {
  return CHAIN_REPRESENTATIVE_TOKENS[chainId] || "eth";
}
