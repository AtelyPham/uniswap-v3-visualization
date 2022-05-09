import { gql, useQuery } from '@apollo/client';
import { useDeltaTimestamps } from 'hooks';
import { TokenData } from 'state/tokens/reducer';
import {
  GetTokenDataQuery,
  OrderDirection,
  Token_OrderBy,
} from 'types/graphql.d';
import { ArrayElement } from 'types/utils';
import {
  formatTokenName,
  formatTokenSymbol,
  get2DayChange,
  getPercentChange,
} from 'utils';
import { useBlocksFromTimestamps } from '../blocks';
import { useEthPrices } from '../prices';

export const GET_TOKEN_DATA = gql`
  query GetTokenData(
    $idIn: [ID!]
    $block: Block_height
    $orderBy: Token_orderBy
    $orderDirection: OrderDirection
  ) {
    tokens(
      where: { id_in: $idIn }
      block: $block
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      symbol
      name
      derivedETH
      volumeUSD
      volume
      feesUSD
      totalValueLockedUSD
    }
  }
`;

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

/**
 * Fetch top addresses by volume
 */
export function useTokenData(tokenAddresses: string[]): {
  loading: boolean;
  error: boolean;
  data:
    | {
        [address: string]: TokenData;
      }
    | undefined;
} {
  // Get blocks in 24h, 48h, 1w ago
  const [t24, t48, tWeek] = useDeltaTimestamps();
  const { blocks, error: blockError } = useBlocksFromTimestamps([
    t24,
    t48,
    tWeek,
  ]);
  const [block24, block48, blockWeek] = blocks ?? [];
  const ethPrices = useEthPrices();

  const commonVariables = {
    idIn: tokenAddresses,
    orderBy: Token_OrderBy.TotalValueLockedUsd,
    orderDirection: OrderDirection.Desc,
  };

  const { loading, error, data } = useQuery<GetTokenDataQuery>(GET_TOKEN_DATA, {
    variables: {
      ...commonVariables,
    },
  });

  const {
    loading: loading24,
    error: error24,
    data: data24,
  } = useQuery<GetTokenDataQuery>(GET_TOKEN_DATA, {
    variables: {
      ...commonVariables,
      block: block24 ? { number: block24.number } : undefined,
    },
  });

  const {
    loading: loading48,
    error: error48,
    data: data48,
  } = useQuery<GetTokenDataQuery>(GET_TOKEN_DATA, {
    variables: {
      ...commonVariables,
      block: block48 ? { number: block48.number } : undefined,
    },
  });

  const {
    loading: loadingWeek,
    error: errorWeek,
    data: dataWeek,
  } = useQuery<GetTokenDataQuery>(GET_TOKEN_DATA, {
    variables: {
      ...commonVariables,
      block: blockWeek ? { number: blockWeek.number } : undefined,
    },
  });

  const anyError = Boolean(
    error || error24 || error48 || blockError || errorWeek,
  );
  const anyLoading = Boolean(
    loading || loading24 || loading48 || loadingWeek || !blocks,
  );

  if (!ethPrices) {
    return {
      loading: true,
      error: false,
      data: undefined,
    };
  }

  if (anyError || anyLoading) {
    return {
      loading: anyLoading,
      error: anyError,
      data: undefined,
    };
  }

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

  return {
    loading: anyLoading,
    error: anyError,
    data: formatted,
  };
}
