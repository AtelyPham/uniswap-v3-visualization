import { gql, useQuery } from '@apollo/client';
import { useClients } from 'hooks';
import { useMemo } from 'react';

export const GET_BLOCKS = (timestamps: string[]) => {
  let queryString = 'query blocks {';
  queryString += timestamps.map(timestamp => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
        number
      }`;
  });
  queryString += '}';
  return gql(queryString);
};

/**
 * for a given array of timestamps, returns block entities
 * @param timestamps
 */
export function useBlocksFromTimestamps(timestamps: number[]): {
  blocks:
    | {
        timestamp: string;
        number: any;
      }[]
    | undefined;
  error: boolean;
} {
  const { blockClient } = useClients();
  const timestampsStr = timestamps.map(ts => ts.toString());
  const {
    data: results,
    loading,
    error,
  } = useQuery(GET_BLOCKS(timestampsStr), {
    client: blockClient,
    fetchPolicy: 'network-only',
  });

  const blocksFormatted = useMemo(() => {
    if (loading || !results?.data) {
      return;
    }

    const formatted = [];
    const networkBlocks = results.data;

    for (const t in networkBlocks) {
      if (networkBlocks[t].length > 0) {
        formatted.push({
          timestamp: t.split('t')[1],
          number: networkBlocks[t][0]['number'],
        });
      }
    }

    return formatted;
  }, [loading, results]);

  return {
    blocks: blocksFormatted,
    error: !!error,
  };
}
