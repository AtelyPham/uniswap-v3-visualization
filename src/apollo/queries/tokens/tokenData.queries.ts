import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { getDeltaTimestamp, useBlockClient, useDeltaTimestamps } from 'hooks';
import { TokenData } from 'state/tokens/reducer';
import {
  GetTokenDataQuery,
  OrderDirection,
  Token_OrderBy,
} from 'types/graphql.d';
import { getBlocksFromTimestamps, useBlocksFromTimestamps } from '../blocks';
import { getEthPrices, useEthPrices } from '../prices';
import { formatTokens } from './private';

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

/**
 *
 * @returns a function to fetch new data
 */
export const useLazyTokenData = () => {
  const [getAllTokens] = useLazyQuery<GetTokenDataQuery>(GET_TOKEN_DATA, {
    fetchPolicy: 'network-only',
  });
  const blockClient = useBlockClient();

  return async function (tokenAddresses: string[]) {
    const commonVars = {
      idIn: tokenAddresses,
      orderBy: Token_OrderBy.TotalValueLockedUsd,
      orderDirection: OrderDirection.Desc,
    };

    try {
      const [t24, t48, tWeek] = getDeltaTimestamp();
      const _blocks = await getBlocksFromTimestamps(
        [t24, t48, tWeek],
        blockClient,
      );
      const blocks = _blocks
        ? _blocks.map(b => parseFloat(b.number))
        : undefined;
      const [_block24, _block48, _blockWeek] = blocks ?? [];

      const ethPrices = await getEthPrices();

      const { loading, error, data } = await getAllTokens({
        variables: { ...commonVars },
      });

      const block24 = _block24 ? { number: _block24 } : undefined;
      const {
        loading: loading24,
        error: error24,
        data: data24,
      } = await getAllTokens({ variables: { ...commonVars, block: block24 } });

      const block48 = _block48 ? { number: _block48 } : undefined;
      const {
        loading: loading48,
        error: error48,
        data: data48,
      } = await getAllTokens({ variables: { ...commonVars, block: block48 } });

      const blockWeek = _blockWeek ? { number: _blockWeek } : undefined;
      const {
        loading: loadingWeek,
        error: errorWeek,
        data: dataWeek,
      } = await getAllTokens({
        variables: { ...commonVars, block: blockWeek },
      });

      const anyError = Boolean(error || error24 || error48 || errorWeek);
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

      const formatted = formatTokens(
        tokenAddresses,
        ethPrices,
        data,
        data24,
        data48,
        dataWeek,
      );

      return {
        loading: anyLoading,
        error: anyError,
        data: formatted,
      };
    } catch (error) {
      console.log(error);
      return {
        loading: false,
        error: true,
        data: undefined,
      };
    }
  };
};

const useCommonQuery = (variables: any) =>
  useQuery<GetTokenDataQuery>(GET_TOKEN_DATA, { variables });

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
  const [_block24, _block48, _blockWeek] = blocks ?? [];
  const ethPrices = useEthPrices();

  const commonVars = {
    idIn: tokenAddresses,
    orderBy: Token_OrderBy.TotalValueLockedUsd,
    orderDirection: OrderDirection.Desc,
  };

  const { loading, error, data } = useCommonQuery({ ...commonVars });

  const block24 = _block24 ? { number: _block24.number } : undefined;
  const {
    loading: loading24,
    error: error24,
    data: data24,
  } = useCommonQuery({ ...commonVars, block: block24 });

  const block48 = _block48 ? { number: _block48.number } : undefined;
  const {
    loading: loading48,
    error: error48,
    data: data48,
  } = useCommonQuery({ ...commonVars, block: block48 });

  const blockWeek = _blockWeek ? { number: _blockWeek.number } : undefined;
  const {
    loading: loadingWeek,
    error: errorWeek,
    data: dataWeek,
  } = useCommonQuery({ ...commonVars, block: blockWeek });

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

  const formatted = formatTokens(
    tokenAddresses,
    ethPrices,
    data,
    data24,
    data48,
    dataWeek,
  );

  return {
    loading: anyLoading,
    error: anyError,
    data: formatted,
  };
}
