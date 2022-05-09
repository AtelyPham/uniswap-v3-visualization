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
  byAddress: {
    [address: string]: {
      data: TokenData | undefined;
      lastUpdated: number | undefined;
    };
  };
}

export const initialState: TokensState = {
  byAddress: {},
};

export default createReducer(initialState, builder =>
  builder
    .addCase(updateTokenData, (state, { payload: { tokens } }) => {
      tokens.map(
        tokenData =>
          (state.byAddress[tokenData.address] = {
            ...state.byAddress[tokenData.address],
            data: tokenData,
            lastUpdated: currentTimestamp(),
          }),
      );
    })
    .addCase(addTokenKeys, (state, { payload: { tokenAddresses } }) => {
      tokenAddresses.map(address => {
        if (!state.byAddress[address]) {
          state.byAddress[address] = {
            data: undefined,
            lastUpdated: undefined,
          };
        }
      });
    }),
);
