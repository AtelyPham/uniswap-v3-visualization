import { createReducer } from '@reduxjs/toolkit';
import { currentTimestamp } from 'utils';
import { updateTransactions } from './actions';
export enum TransactionType {
  SWAP,
  MINT,
  BURN,
}

export type TransactionData = {
  type: TransactionType;
  hash: string;
  timestamp: string;
  sender: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Address: string;
  token1Address: string;
  amountUSD: number;
  amountToken0: number;
  amountToken1: number;
};

export interface TransactionState {
  byNetwork: {
    transactions?: TransactionData[];
    lastUpdate?: number;
  };
}

export const initialState: TransactionState = {
  byNetwork: {},
};

export default createReducer(initialState, builder =>
  builder.addCase(
    updateTransactions,
    (state, { payload: { transactions } }) => {
      state.byNetwork.transactions = transactions;
      state.byNetwork.lastUpdate = currentTimestamp();
    },
  ),
);
