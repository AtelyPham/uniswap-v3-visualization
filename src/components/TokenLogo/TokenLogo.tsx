import { Logo } from 'components/Logo';
import React from 'react';

export const getTokenLogoURLBySymbol = (symbol: string) => {
  return `https://raw.githubusercontent.com/shed3/react-crypto-icons/main/src/assets/${symbol.toLowerCase()}.svg`;
};

const TokenLogo: React.FC<{
  symbol: string;
  [key: string]: any;
}> = ({ symbol, ...rest }) => {
  return (
    <Logo src={getTokenLogoURLBySymbol(symbol)} className="w-4 h-4" {...rest} />
  );
};

export default TokenLogo;
