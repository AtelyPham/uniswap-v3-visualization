import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { updateTransactions } from './actions';
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
