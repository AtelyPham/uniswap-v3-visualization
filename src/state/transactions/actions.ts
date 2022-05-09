import { createAction } from '@reduxjs/toolkit';
import { TransactionData, TransactionStatusState } from './reducer';

export const updateTransactions = createAction<{
  transactions: TransactionData[];
}>('transactions/updateTransactions');

export const refreshTransaction = createAction(
  'transactions/refreshTransactions',
);

export const updateTransactionStatus = createAction<{
  status: TransactionStatusState;
}>('transactions/updateTransactionStatus');
