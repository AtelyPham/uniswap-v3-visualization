import { WETH_ADDRESSES } from 'constants/index';

export const formatTokenSymbol = (address: string, symbol: string) => {
  if (WETH_ADDRESSES.includes(address)) {
    return 'ETH';
  }
  return symbol;
};

export function formatTokenName(address: string, name: string) {
  if (WETH_ADDRESSES.includes(address)) {
    return 'Ether';
  }
  return name;
}
