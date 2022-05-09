import { createAction } from '@reduxjs/toolkit';
import { Transaction } from './reducer';

export const updateTransactions = createAction<{ transactions: Transaction[] }>(
  'protocol/updateTransactions',
);
