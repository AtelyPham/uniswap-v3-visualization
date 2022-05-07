import { GetTopPoolsQuery } from 'types/graphql.d';
import { gql, useQuery } from '@apollo/client';
import { useClients } from 'hooks';
import { useMemo } from 'react';

export const GET_TOP_POOLS = gql`
  query GetTopPools(
    $first: Int
    $orderBy: Pool_orderBy
    $orderDirection: OrderDirection
  ) {
    pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
      id
    }
  }
`;

/**
 * Fetch top addresses by volume
 */
export const useTopPoolAddresses = (): {
  loading: boolean;
  error: boolean;
  addresses: string[] | undefined;
} => {
  const { dataClient } = useClients();
  const { loading, error, data } = useQuery<GetTopPoolsQuery>(GET_TOP_POOLS, {
    client: dataClient,
    fetchPolicy: 'cache-first',
  });

  const formattedData = useMemo(() => {
    if (data) {
      return data.pools.map(p => p.id);
    } else {
      return undefined;
    }
  }, [data]);

  return {
    loading: loading,
    error: Boolean(error),
    addresses: formattedData,
  };
};
