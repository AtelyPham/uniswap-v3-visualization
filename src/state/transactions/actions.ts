import { createAction } from '@reduxjs/toolkit';
import { TransactionData } from './reducer';

export const updateTransactions = createAction<{
  transactions: TransactionData[];
}>('protocol/updateTransactions');
