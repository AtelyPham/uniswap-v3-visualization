import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import { useClients } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { splitQuery } from 'utils';

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
  const [blocks, setBlocks] = useState<any>();
  const [error, setError] = useState(false);

  const { blockClient } = useClients();

  useEffect(() => {
    async function fetchData() {
      const results = await splitQuery(GET_BLOCKS, blockClient, [], timestamps);
      if (!results) {
        setError(() => true);
        return;
      }

      setBlocks((prev: any) => ({ ...(prev ?? {}), ...results }));
    }

    if (!error) {
      fetchData();
    }
  }, []);

  const blocksFormatted = useMemo(() => {
    if (!blocks || blocks.length == 0 || error) {
      return;
    }

    const formatted = [];
    for (const t in blocks) {
      if (blocks[t].length > 0) {
        formatted.push({
          timestamp: t.split('t')[1],
          number: parseInt(blocks[t][0]['number']),
        });
      }
    }

    return formatted;
  }, [blocks, error]);

  return {
    blocks: blocksFormatted,
    error,
  };
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */
export async function getBlocksFromTimestamps(
  timestamps: number[],
  blockClient: ApolloClient<NormalizedCacheObject>,
  skipCount = 500,
) {
  if (timestamps?.length === 0) {
    return [];
  }
  const fetchedData: any = await splitQuery(
    GET_BLOCKS,
    blockClient,
    [],
    timestamps,
    skipCount,
  );

  const blocks: any[] = [];
  if (fetchedData) {
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: fetchedData[t][0]['number'],
        });
      }
    }
  }
  return blocks;
}
