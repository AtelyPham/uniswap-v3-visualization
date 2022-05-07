import { WETH_ADDRESSES } from 'constants/index';

export const formatTokenSymbol = (address: string, symbol: string) => {
  if (address === '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270') {
    return 'MATIC';
  }

  if (WETH_ADDRESSES.includes(address)) {
    return 'ETH';
  }
  return symbol;
};
