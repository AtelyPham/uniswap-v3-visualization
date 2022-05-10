import { gql, useQuery } from '@apollo/client';
import { useDeltaTimestamps } from 'hooks';
import { useMemo } from 'react';
import { NetworkData } from 'state/network/reducer';
import {
  GetNetworkDataQuery,
  GetNetworkDataQueryVariables,
} from 'types/graphql.d';
import { useBlocksFromTimestamps } from '../blocks';
import { formatNetworkData } from './private';

export const GET_NETWORK_DATA = gql`
  query GetNetworkData($block: Block_height) {
    factories(block: $block, first: 1) {
      txCount
      totalVolumeUSD
      totalFeesUSD
      totalValueLockedUSD
    }
  }
`;

const useCommonQuery = (variables: GetNetworkDataQueryVariables = {}) =>
  useQuery<GetNetworkDataQuery>(GET_NETWORK_DATA, { variables });

export function useFetchNetworkData(): {
  loading: boolean;
  error: boolean;
  data: NetworkData | undefined;
} {
  const [t24, t48] = useDeltaTimestamps();
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48]);
  const [_block24, _block48] = blocks ?? [];

  // fetch all data
  const { loading, error, data } = useCommonQuery();

  const block24 = _block24 ? _block24.number : 0;
  const {
    loading: loading24,
    error: error24,
    data: data24,
  } = useCommonQuery({ block: { number: block24 } });

  const block48 = _block48 ? _block48.number : 0;
  const {
    loading: loading48,
    error: error48,
    data: data48,
  } = useCommonQuery({ block: { number: block48 } });

  const anyError = Boolean(error || error24 || error48 || blockError);
  const anyLoading = Boolean(loading || loading24 || loading48);

  const parsed = data?.factories?.[0];
  const parsed24 = data24?.factories?.[0];
  const parsed48 = data48?.factories?.[0];

  const formattedData: NetworkData | undefined = useMemo(() => {
    if (anyError || anyLoading || !blocks) {
      return undefined;
    }

    return formatNetworkData(parsed, parsed24, parsed48);
  }, [anyError, anyLoading, blocks, parsed, parsed24, parsed48]);

  return {
    loading: anyLoading,
    error: anyError,
    data: formattedData,
  };
}
