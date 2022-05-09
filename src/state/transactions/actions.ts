import { createAction } from '@reduxjs/toolkit';
import { TransactionData } from './reducer';

export const updateTransactions = createAction<{
  transactions: TransactionData[];
}>('transactions/updateTransactions');

export const refreshTransaction = createAction(
  'transactions/refreshTransactions',
);
