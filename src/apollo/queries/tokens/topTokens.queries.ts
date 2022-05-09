import { useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useClients } from 'hooks';
import { TopTokensQuery } from 'types/graphql.d';

export const TOP_TOKENS = gql`
  query topTokens {
    tokens(
      first: 50
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
    }
  }
`;

export const useLazyTopTopTokenAddresses = () => {
  const [getTopTokens] = useLazyQuery<TopTokensQuery>(TOP_TOKENS, {
    fetchPolicy: 'network-only',
  });

  return async function () {
    const { loading, error, data } = await getTopTokens();
    if (!loading && !error && data) {
      return data.tokens.map(t => t.id);
    }
    return undefined;
  };
};

/**
 * Fetch top addresses by volume
 */
export function useTopTokenAddresses(): {
  loading: boolean;
  error: boolean;
  addresses: string[] | undefined;
} {
  const { dataClient } = useClients();

  const { loading, error, data } = useQuery<TopTokensQuery>(TOP_TOKENS, {
    client: dataClient,
  });

  const formattedData = useMemo(() => {
    if (!data) {
      return undefined;
    }

    return data.tokens.map(t => t.id);
  }, [data]);

  return {
    loading: loading,
    error: Boolean(error),
    addresses: formattedData,
  };
}
