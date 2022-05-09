import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { getDeltaTimestamp, useBlockClient, useDeltaTimestamps } from 'hooks';
import { PoolData } from 'state/pools/reducer';
import {
  GetPoolDataQuery,
  GetPoolDataQueryVariables,
  OrderDirection,
  Pool_OrderBy,
} from 'types/graphql.d';
import { getBlocksFromTimestamps, useBlocksFromTimestamps } from '../blocks';
import { formatPools } from './private';

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

/**
 *
 * @returns a function to fetch new data
 */
export function useLazyPoolData() {
  const [getAllPools] = useLazyQuery<GetPoolDataQuery>(GET_POOL_DATA, {
    fetchPolicy: 'network-only',
  });

  const blockClient = useBlockClient();

  return async function (poolAddresses: string[]) {
    const commonVars = {
      idIn: poolAddresses,
      orderBy: Pool_OrderBy.TotalValueLockedUsd,
      orderDirection: OrderDirection.Desc,
    };

    try {
      // Get blocks in 24h, 48h, 1w ago
      const [t24, t48, tWeek] = getDeltaTimestamp();
      const _blocks = await getBlocksFromTimestamps(
        [t24, t48, tWeek],
        blockClient,
      );
      const blocks = _blocks
        ? _blocks.map(b => parseFloat(b.number))
        : undefined;
      const [_block24, _block48, _blockWeek] = blocks ?? [];

      const { loading, data, error } = await getAllPools({
        variables: { ...commonVars },
      });

      const block24 = _block24 ? { number: _block24 } : undefined;
      const {
        loading: loading24,
        error: error24,
        data: data24,
      } = await getAllPools({
        variables: { ...commonVars, block: block24 },
      });

      const block48 = _block48 ? { number: _block48 } : undefined;
      const {
        loading: loading48,
        error: error48,
        data: data48,
      } = await getAllPools({
        variables: { ...commonVars, block: block48 },
      });

      const blockWeek = _blockWeek ? { number: _blockWeek } : undefined;
      const {
        loading: loadingWeek,
        error: errorWeek,
        data: dataWeek,
      } = await getAllPools({
        variables: { ...commonVars, block: blockWeek },
      });

      const hasAnyError = [error, error24, error48, errorWeek].some(
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

      const formatted = formatPools(
        poolAddresses,
        data,
        data24,
        data48,
        dataWeek,
      );

      return {
        loading: hasAnyLoading,
        error: hasAnyError,
        data: formatted,
      };
    } catch (error: any) {
      return {
        error: true,
        data: undefined,
      };
    }
  };
}

const useCommonQuery = (variables: GetPoolDataQueryVariables) =>
  useQuery(GET_POOL_DATA, { variables });

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
  // Get blocks in 24h, 48h, 1w ago
  const [t24, t48, tWeek] = useDeltaTimestamps();
  const { blocks, error: blocksError } = useBlocksFromTimestamps([
    t24,
    t48,
    tWeek,
  ]);
  const [_block24, _block48, _blockWeek] = blocks ?? [];

  const commonVars = {
    idIn: poolAddresses,
    orderBy: Pool_OrderBy.TotalValueLockedUsd,
    orderDirection: OrderDirection.Desc,
  };

  const { loading, error, data } = useCommonQuery({
    ...commonVars,
  });

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

  const formattedPools = formatPools(
    poolAddresses,
    data,
    data24,
    data48,
    dataWeek,
  );

  return {
    loading: hasAnyLoading,
    error: hasAnyError,
    data: formattedPools,
  };
};
