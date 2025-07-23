import tokenList from "@uniswap/default-token-list";

export interface Token {
  chainId: string;
  symbol: string;
}

// Helper function to get tokens by chain ID
export function getTokensByChain(chainId: string): typeof tokenList.tokens {
  return tokenList.tokens.filter((token) => token.chainId === Number(chainId));
}

// Helper function to get a specific token
export function getToken(
  chainId: string,
  symbol: string,
): (typeof tokenList.tokens)[0] | undefined {
  return tokenList.tokens.find(
    (token) =>
      token.chainId === Number(chainId) &&
      token.symbol.toLowerCase() === symbol.toLowerCase(),
  );
}

export const CHAIN_NAMES: Record<number, string> = {
  1: "ethereum",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  10: "optimism",
  56: "bnb",
  137: "polygon",
  238: "blast",
  324: "zkSync",
  8453: "base",
  80001: "mumbai",
  42161: "arbitrum",
  43114: "avalanche",
  11155111: "sepolia",
  42220: "celo",
  42: "kovan",
  7777777: "zora",
  480: "worldchain",
};

export function getNetworkName(chainId: number): string {
  return CHAIN_NAMES[chainId] || `Chain ${chainId}`;
}

// Export the full token list
export { tokenList };
