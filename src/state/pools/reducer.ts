import { createReducer } from '@reduxjs/toolkit';
import { currentTimestamp } from 'utils';
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
  byAddress: {
    [address: string]: {
      data: PoolData | undefined;
      lastUpdated: number | undefined;
    };
  };
}

export const initialState = {
  byAddress: {},
} as PoolsState;

export default createReducer(initialState, builder =>
  builder
    .addCase(updatePoolData, (state, { payload: { pools } }) => {
      pools.map(
        poolData =>
          (state.byAddress[poolData.address] = {
            ...state.byAddress[poolData.address],
            data: poolData,
            lastUpdated: currentTimestamp(),
          }),
      );
    })
    // add address to byAddress keys if not included yet
    .addCase(addPoolKeys, (state, { payload: { poolAddresses } }) => {
      poolAddresses.map(address => {
        if (!state.byAddress[address]) {
          state.byAddress[address] = {
            data: undefined,
            lastUpdated: undefined,
          };
        }
      });
    }),
);
