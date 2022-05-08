import { createReducer } from '@reduxjs/toolkit';
import { addPoolKeys, updatePoolData } from './actions';

export interface PoolDataToken {
  address: string;
  symbol: string;
}

export interface PoolData {
  address: string;
  feeTier: number;
  token0: PoolDataToken;
  token1: PoolDataToken;
  volumeUSD: number;
  volumeUSDChange: number;
  volumeUSDWeek: number;
  tvlUSD: number;
  tvlUSDChange: number;
}

export interface PoolsState {
  [address: string]: {
    data: PoolData | undefined;
    lastUpdated: number | undefined;
  };
}

export const initialState = {} as PoolsState;

export default createReducer(initialState, builder =>
  builder
    .addCase(updatePoolData, (state, { payload: { pools } }) => {
      pools.map(
        poolData =>
          (state[poolData.address] = {
            ...state[poolData.address],
            data: poolData,
            lastUpdated: new Date().getTime(),
          }),
      );
    })
    // add address to byAddress keys if not included yet
    .addCase(addPoolKeys, (state, { payload: { poolAddresses } }) => {
      poolAddresses.map(address => {
        if (!state[address]) {
          state[address] = {
            data: undefined,
            lastUpdated: undefined,
          };
        }
      });
    }),
);
