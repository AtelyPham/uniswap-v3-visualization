import { createReducer } from '@reduxjs/toolkit';
import { StatusState } from 'state';
import { currentTimestamp } from 'utils';
import {
  updateTokenData,
  addTokenKeys,
  refreshToken,
  updateTokenStatus,
} from './actions';

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

export type TokenStatusState = StatusState;

export interface TokensState {
  byAddress: {
    [address: string]: {
      data: TokenData | undefined;
      lastUpdated: number | undefined;
    };
  };
  status: TokenStatusState;
  lastUpdated?: number | undefined;
}

export const initialState: TokensState = {
  byAddress: {},
  status: {
    loading: false,
    error: false,
  },
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
      state.lastUpdated = currentTimestamp();
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
      state.lastUpdated = currentTimestamp();
    })
    .addCase(refreshToken, state => {
      state.byAddress = initialState.byAddress;
      state.lastUpdated = currentTimestamp();
    })
    .addCase(updateTokenStatus, (state, { payload: { status } }) => {
      state.status = status;
      state.lastUpdated = currentTimestamp();
    }),
);
