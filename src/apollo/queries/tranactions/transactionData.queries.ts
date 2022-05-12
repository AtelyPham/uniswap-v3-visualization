import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { TransactionData } from 'state/transactions/reducer';
import { GetAllTransactionsQuery } from 'types/graphql.d';
import { formatTransactions } from './private';

const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions {
    transactions(first: 500, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      mints {
        pool {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        owner
        sender
        origin
        amount0
        amount1
        amountUSD
      }
      swaps {
        pool {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        origin
        amount0
        amount1
        amountUSD
      }
      burns {
        pool {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        owner
        origin
        amount0
        amount1
        amountUSD
      }
    }
  }
`;

/**
 *
 * @returns a function to fetch new data
 */
export function useLazyTransactionData() {
  const [getAllTransactions] = useLazyQuery<GetAllTransactionsQuery>(
    GET_ALL_TRANSACTIONS,
    {
      fetchPolicy: 'network-only',
    },
  );

  return async function () {
    try {
      const { data, error } = await getAllTransactions();

      if (!data) {
        return {
          error: error,
          data: undefined,
        };
      }

      const formatted = formatTransactions(data);
      return {
        error: false,
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

export function useTransactionData(): TransactionData[] | undefined {
  try {
    const { data, error, loading } = useQuery<GetAllTransactionsQuery>(
      GET_ALL_TRANSACTIONS,
      {
        fetchPolicy: 'network-only',
      },
    );

    if (error || loading || !data) {
      return undefined;
    }

    return formatTransactions(data);
  } catch {
    return undefined;
  }
}
