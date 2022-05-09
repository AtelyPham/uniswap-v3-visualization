import { createReducer } from '@reduxjs/toolkit';
import { currentTimestamp } from 'utils';
import { updateTokenData, addTokenKeys } from './actions';

export interface TokenData {
  name: string;
  symbol: string;
  address: string;
  volumeUSD: number;
  tvlUSD: number;
  priceUSD: number;
  priceUSDChange: number;
  priceUSDChangeWeek: number;
}

export interface TokensState {
  [address: string]: {
    data: TokenData | undefined;
    lastUpdated: number | undefined;
  };
}

export const initialState: TokensState = {};

export default createReducer(initialState, builder =>
  builder
    .addCase(updateTokenData, (state, { payload: { tokens } }) => {
      tokens.map(
        tokenData =>
          (state[tokenData.address] = {
            ...state[tokenData.address],
            data: tokenData,
            lastUpdated: currentTimestamp(),
          }),
      );
    })
    .addCase(addTokenKeys, (state, { payload: { tokenAddresses } }) => {
      tokenAddresses.map(address => {
        if (!state[address]) {
          state[address] = {
            data: undefined,
            lastUpdated: undefined,
          };
        }
      });
    }),
);
