import { NetworkData } from './reducer';
import { createAction } from '@reduxjs/toolkit';

export const updateNetworkData = createAction<{
  networkData: NetworkData;
}>('network/updateNetworkData');
