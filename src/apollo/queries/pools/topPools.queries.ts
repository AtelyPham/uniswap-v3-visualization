import { GetTopPoolsQuery } from 'types/graphql.d';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useClients } from 'hooks';
import { useMemo } from 'react';

export const GET_TOP_POOLS = gql`
  query GetTopPools {
    pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
      id
    }
  }
`;

export const useLazyTopPoolAddresses = () => {
  const [getTopPools] = useLazyQuery<GetTopPoolsQuery>(GET_TOP_POOLS, {
    fetchPolicy: 'network-only',
  });

  return async function () {
    const { loading, error, data } = await getTopPools();
    const formattedData = data ? data.pools.map(p => p.id) : undefined;
    return { loading, error, data: formattedData };
  };
};

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
