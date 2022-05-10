import { createReducer } from '@reduxjs/toolkit';
import { currentTimestamp } from 'utils';
import { updateNetworkData } from './actions';

export interface NetworkData {
  volumeUSD: number;
  volumeUSDChange: number;

  tvlUSD: number;
  tvlUSDChange: number;

  feesUSD: number;
  feeChange: number;

  txCount: number;
  txCountChange: number;
}

export interface NetworkState {
  byNetwork: {
    readonly lastUpdated?: number | undefined;
    readonly data?: NetworkData | undefined;
  };
}

export const initialState: NetworkState = {
  byNetwork: {},
};

export default createReducer(initialState, builder =>
  builder.addCase(updateNetworkData, (state, { payload: { networkData } }) => {
    state.byNetwork.data = networkData;
    state.byNetwork.lastUpdated = currentTimestamp();
  }),
);
