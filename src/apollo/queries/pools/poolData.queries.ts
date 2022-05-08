import { gql, useQuery } from '@apollo/client';
import { useDeltaTimestamps } from 'hooks';
import { PoolData } from 'state/pools/reducer';
import {
  GetPoolDataQuery,
  OrderDirection,
  Pool_OrderBy,
} from 'types/graphql.d';
import { ArrayElement } from 'types/utils';
import { formatTokenSymbol, get2DayChange } from 'utils';
import { useBlocksFromTimestamps } from '../blocks';

export const GET_POOL_DATA = gql`
  query GetPoolData(
    $idIn: [ID!]
    $block: Block_height
    $orderBy: Pool_orderBy
    $orderDirection: OrderDirection
  ) {
    pools(
      where: { id_in: $idIn }
      block: $block
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      feeTier
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      volumeUSD
      totalValueLockedUSD
    }
  }
`;

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

export const usePoolData = (
  poolAddresses: string[],
): {
  loading: boolean;
  error: boolean;
  data:
    | {
        [address: string]: PoolData;
      }
    | undefined;
} => {
  const isSkip = !poolAddresses || !poolAddresses.length;

  // Get blocks in 24h, 48h, 1w ago
  const [t24, t48, tWeek] = useDeltaTimestamps();
  const { blocks, error: blocksError } = useBlocksFromTimestamps([
    t24,
    t48,
    tWeek,
  ]);
  const [block24, block48, blockWeek] = blocks ?? [];

  const commonVariables = {
    idIn: poolAddresses,
    orderBy: Pool_OrderBy.TotalValueLockedUsd,
    orderDirection: OrderDirection.Desc,
  };

  const { loading, error, data } = useQuery<GetPoolDataQuery>(GET_POOL_DATA, {
    variables: {
      ...commonVariables,
    },
    skip: isSkip,
  });

  const {
    loading: loading24,
    error: error24,
    data: data24,
  } = useQuery<GetPoolDataQuery>(GET_POOL_DATA, {
    variables: {
      ...commonVariables,
      block: block24
        ? {
            number: block24.number,
          }
        : undefined,
    },
    skip: isSkip,
  });

  const {
    loading: loading48,
    error: error48,
    data: data48,
  } = useQuery<GetPoolDataQuery>(GET_POOL_DATA, {
    variables: {
      ...commonVariables,
      block: block48
        ? {
            number: block48.number,
          }
        : undefined,
    },
    skip: isSkip,
  });

  const {
    loading: loadingWeek,
    error: errorWeek,
    data: dataWeek,
  } = useQuery<GetPoolDataQuery>(GET_POOL_DATA, {
    variables: {
      ...commonVariables,
      block: blockWeek
        ? {
            number: blockWeek.number,
          }
        : undefined,
    },
    skip: isSkip,
  });

  const hasAnyError = [error, error24, error48, errorWeek, blocksError].some(
    err => !!err,
  );
  const hasAnyLoading = [loading, loading24, loading48, loadingWeek].some(
    l => !!l,
  );

  if (hasAnyError || hasAnyLoading) {
    return {
      loading: hasAnyLoading,
      error: hasAnyError,
      data: undefined,
    };
  }

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

  return {
    loading: hasAnyLoading,
    error: hasAnyError,
    data: formattedPools,
  };
};
