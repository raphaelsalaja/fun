function getTokenLogo(chain: string, address: string): string {
  return `https://raw.githubusercontent.com/Uniswap/assets/refs/heads/master/blockchains/${chain}/assets/${address}/logo.png`;
}

function getChainLogo(chain: string): string {
  return `https://raw.githubusercontent.com/Uniswap/assets/refs/heads/master/blockchains/${chain}/info/logo.png`;
}

export { getTokenLogo, getChainLogo };
