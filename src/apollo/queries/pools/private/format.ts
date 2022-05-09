import { PoolData } from 'state/pools/reducer';
import { GetPoolDataQuery } from 'types/graphql.d';
import { ArrayElement } from 'types/utils';
import { formatTokenSymbol, get2DayChange } from 'utils';

const parsePools = (pools: GetPoolDataQuery['pools']) =>
  pools.reduce(
    (
      accum: { [address: string]: ArrayElement<GetPoolDataQuery['pools']> },
      poolData,
    ) => {
      accum[poolData.id] = poolData;
      return accum;
    },
    {},
  );

export default (
  poolAddresses: string[],
  data: GetPoolDataQuery | undefined,
  data24: GetPoolDataQuery | undefined,
  data48: GetPoolDataQuery | undefined,
  dataWeek: GetPoolDataQuery | undefined,
) => {
  const parsed = data ? parsePools(data.pools) : {};
  const parsed24 = data24 ? parsePools(data24.pools) : {};
  const parsed48 = data48 ? parsePools(data48.pools) : {};
  const parsedWeek = dataWeek ? parsePools(dataWeek.pools) : {};

  // format data and calculate daily changes
  const formattedPools = poolAddresses.reduce(
    (accum: { [address: string]: PoolData }, address) => {
      const current: ArrayElement<GetPoolDataQuery['pools']> | undefined =
        parsed[address];
      const oneDay: ArrayElement<GetPoolDataQuery['pools']> | undefined =
        parsed24[address];
      const twoDay: ArrayElement<GetPoolDataQuery['pools']> | undefined =
        parsed48[address];
      const week: ArrayElement<GetPoolDataQuery['pools']> | undefined =
        parsedWeek[address];

      const [volumeUSD, volumeUSDChange] =
        current && oneDay && twoDay
          ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
          : current
          ? [parseFloat(current.volumeUSD), 0]
          : [0, 0];

      const volumeUSDWeek =
        current && week
          ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD)
          : current
          ? parseFloat(current.volumeUSD)
          : 0;

      const tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0;

      const tvlUSDChange =
        current && oneDay
          ? ((parseFloat(current.totalValueLockedUSD) -
              parseFloat(oneDay.totalValueLockedUSD)) /
              parseFloat(
                oneDay.totalValueLockedUSD === '0'
                  ? '1'
                  : oneDay.totalValueLockedUSD,
              )) *
            100
          : 0;

      const feeTier = current ? parseInt(current.feeTier) : 0;

      if (current) {
        accum[address] = {
          address,
          feeTier,
          token0: {
            address: current.token0.id,
            symbol: formatTokenSymbol(current.token0.id, current.token0.symbol),
          },
          token1: {
            address: current.token1.id,
            symbol: formatTokenSymbol(current.token1.id, current.token1.symbol),
          },
          volumeUSD,
          volumeUSDChange,
          volumeUSDWeek,
          tvlUSD,
          tvlUSDChange,
        };
      }

      return accum;
    },
    {},
  );

  return formattedPools;
};
