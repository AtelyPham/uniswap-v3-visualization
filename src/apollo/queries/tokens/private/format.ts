import { EthPrices } from 'apollo/queries/prices';
import { TokenData } from 'state/tokens/reducer';
import { GetTokenDataQuery } from 'types/graphql.d';
import { ArrayElement } from 'types/utils';
import {
  get2DayChange,
  getPercentChange,
  formatTokenName,
  formatTokenSymbol,
} from 'utils';

const parseTokens = (tokens: GetTokenDataQuery['tokens']) =>
  tokens.reduce(
    (
      accum: { [address: string]: ArrayElement<GetTokenDataQuery['tokens']> },
      poolData,
    ) => {
      accum[poolData.id] = poolData;
      return accum;
    },
    {},
  );

export default (
  tokenAddresses: string[],
  ethPrices: EthPrices,
  data: GetTokenDataQuery | undefined,
  data24: GetTokenDataQuery | undefined,
  data48: GetTokenDataQuery | undefined,
  dataWeek: GetTokenDataQuery | undefined,
) => {
  const parsed = data ? parseTokens(data.tokens) : {};
  const parsed24 = data24 ? parseTokens(data24.tokens) : {};
  const parsed48 = data48 ? parseTokens(data48.tokens) : {};
  const parsedWeek = dataWeek ? parseTokens(dataWeek.tokens) : {};

  // format data and calculate daily changes
  const formatted = tokenAddresses.reduce(
    (accum: { [address: string]: TokenData }, address) => {
      const current: ArrayElement<GetTokenDataQuery['tokens']> | undefined =
        parsed[address];
      const oneDay: ArrayElement<GetTokenDataQuery['tokens']> | undefined =
        parsed24[address];
      const twoDay: ArrayElement<GetTokenDataQuery['tokens']> | undefined =
        parsed48[address];
      const week: ArrayElement<GetTokenDataQuery['tokens']> | undefined =
        parsedWeek[address];

      const [volumeUSD] =
        current && oneDay && twoDay
          ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
          : current
          ? [parseFloat(current.volumeUSD), 0]
          : [0, 0];

      const tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0;
      const priceUSD = current
        ? parseFloat(current.derivedETH) * ethPrices.current
        : 0;
      const priceUSDOneDay = oneDay
        ? parseFloat(oneDay.derivedETH) * ethPrices.oneDay
        : 0;
      const priceUSDWeek = week
        ? parseFloat(week.derivedETH) * ethPrices.week
        : 0;
      const priceUSDChange =
        priceUSD && priceUSDOneDay
          ? getPercentChange(priceUSD.toString(), priceUSDOneDay.toString())
          : 0;

      const priceUSDChangeWeek =
        priceUSD && priceUSDWeek
          ? getPercentChange(priceUSD.toString(), priceUSDWeek.toString())
          : 0;

      accum[address] = {
        address,
        name: current ? formatTokenName(address, current.name) : '',
        symbol: current ? formatTokenSymbol(address, current.symbol) : '',
        volumeUSD,
        tvlUSD,
        priceUSD,
        priceUSDChange,
        priceUSDChangeWeek,
      };

      return accum;
    },
    {},
  );

  return formatted;
};
