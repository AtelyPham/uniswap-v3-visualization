import { Logo } from 'components/Logo';
import React, { useMemo } from 'react';
import { isAddress } from 'utils';

export const getTokenLogoURLBySymbol = (symbol: string) => {
  return `https://raw.githubusercontent.com/shed3/react-crypto-icons/main/src/assets/${symbol.toLowerCase()}.svg`;
};

export const getTokenLogoURLByAddress = (address: string) => {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
};

const TokenLogo: React.FC<{
  address: string;
  symbol: string;
  [key: string]: any;
}> = ({ address, symbol, ...rest }) => {
  const srcs = useMemo(() => {
    const checkSummed = isAddress(address);

    if (checkSummed && address) {
      return [
        getTokenLogoURLByAddress(checkSummed),
        getTokenLogoURLBySymbol(symbol),
      ];
    }
    return [];
  }, [address, symbol]);

  return <Logo srcs={srcs} className="w-4 h-4" {...rest} />;
};

export default TokenLogo;
