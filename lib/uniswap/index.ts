import { getNetworkName } from "../tokens";

const SwappedAssets = ["A8", "AAVE"];

function getTokenLogo(chain: string, address: string, symbol: string): string {
  if (SwappedAssets.includes(symbol)) {
    return `/images/tokens/${symbol}.svg`;
  }

  return `https://raw.githubusercontent.com/Uniswap/assets/refs/heads/master/blockchains/${resolveChainName(chain)}/assets/${address}/logo.png`;
}

function getChainLogo(chain: string): string {
  if (SwappedAssets.includes(chain)) {
    return `/images/tokens/${chain}.svg`;
  }

  return `https://raw.githubusercontent.com/Uniswap/assets/refs/heads/master/blockchains/${resolveChainName(chain)}/info/logo.png`;
}

export function resolveChainName(chain: string) {
  chain = Number.isNaN(Number(chain)) ? chain : getNetworkName(Number(chain));
  return chain;
}

export { getTokenLogo, getChainLogo };
