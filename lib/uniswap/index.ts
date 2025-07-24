import { getNetworkName } from "../tokens";

const SwappedAssets = [
  { address: "0x3E5A19c91266aD8cE2477B91585d1856B84062dF", symbol: "a8" },
  { address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", symbol: "aave" },
];

function getTokenLogo(chain: string, address: string): string {
  const swappedAsset = SwappedAssets.find(
    (asset) => asset.address.toLowerCase() === address.toLowerCase(),
  );

  if (swappedAsset) {
    return `images/tokens/${swappedAsset.symbol}.svg`;
  }

  return `https://raw.githubusercontent.com/Uniswap/assets/refs/heads/master/blockchains/${resolveChainName(chain)}/assets/${address}/logo.png`;
}

function getChainLogo(chain: string): string {
  const swappedAsset = SwappedAssets.find(
    (asset) => asset.address.toLowerCase() === chain.toLowerCase(),
  );

  if (swappedAsset) {
    return `images/tokens/${swappedAsset.symbol}.svg`;
  }

  return `https://raw.githubusercontent.com/Uniswap/assets/refs/heads/master/blockchains/${resolveChainName(chain)}/info/logo.png`;
}

export function resolveChainName(chain: string) {
  chain = Number.isNaN(Number(chain)) ? chain : getNetworkName(Number(chain));
  return chain;
}

export { getTokenLogo, getChainLogo };
