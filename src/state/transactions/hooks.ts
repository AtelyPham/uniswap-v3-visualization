import { useLazyTransactionData } from 'apollo';
import { useDataClient } from 'hooks';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { refreshTransaction, updateTransactions } from './actions';
import { TransactionData } from './reducer';

/**
 *
 * @returns a tuple in which the first element is
 * the list of transactions and the second element
 * is an update function to update transactions
 */
export function useTransaction(): [
  TransactionData[] | undefined,
  (transactions: TransactionData[]) => void,
] {
  const transactions = useSelector(
    (state: AppState) => state.transactions.byNetwork.transactions,
  );

  const dispatch = useDispatch<AppDispatch>();
  const setTransactions = useCallback(
    (transactions: TransactionData[]) =>
      dispatch(updateTransactions({ transactions })),
    [dispatch],
  );

  return [transactions, setTransactions];
}

/**
 *
 * @returns a function to fetch latest transactions
 * and udpate to redux store
 *
 */
export function useRefreshTransaction(): () => void {
  const dispatch = useDispatch<AppDispatch>();

  const fetchTransactions = useLazyTransactionData();

  // Function to refresh transactions in the store
  const refreshStore = useCallback(
    () => dispatch(refreshTransaction()),
    [dispatch],
  );

  const client = useDataClient();

  return useCallback(() => {
    refreshStore();
    fetchTransactions();
  }, [client, refreshTransaction]);
}
