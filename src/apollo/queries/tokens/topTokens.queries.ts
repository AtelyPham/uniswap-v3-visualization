import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
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
