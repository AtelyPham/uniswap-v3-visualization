import { useLazyTransactionData } from 'apollo';
import { useDataClient } from 'hooks';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import {
  refreshTransaction,
  updateTransactions,
  updateTransactionStatus,
} from './actions';
import {
  TransactionData,
  TransactionState,
  TransactionStatusState,
} from './reducer';

export function useTransactionState(): TransactionState {
  return useSelector((state: AppState) => state.transactions);
}

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
 * @returns a tuple in which the first element is
 * current transaction status state store in redus.
 * The second element is a function to update the store
 */
export function useTransactionStatus(): [
  TransactionStatusState,
  (status: TransactionStatusState) => void,
] {
  const status = useSelector((state: AppState) => state.transactions.status);

  const dispatch = useDispatch<AppDispatch>();
  const setTransactionStatusState = useCallback(
    (status: TransactionStatusState) =>
      dispatch(updateTransactionStatus({ status })),
    [dispatch],
  );

  return [status, setTransactionStatusState];
}

/**
 *
 * @returns a function to fetch latest transactions
 * and udpate to redux store
 *
 */
export function useRefreshTransaction(): () => Promise<void> {
  const dispatch = useDispatch<AppDispatch>();

  const fetchTransactions = useLazyTransactionData();
  const [, setStatus] = useTransactionStatus();

  // Function to refresh transactions in the store
  const refreshStore = useCallback(
    () => dispatch(refreshTransaction()),
    [dispatch],
  );

  const client = useDataClient();

  return useCallback(async () => {
    setStatus({ loading: true, error: undefined });

    refreshStore();
    await fetchTransactions();

    setStatus({ loading: false });
  }, [client, refreshStore]);
}
