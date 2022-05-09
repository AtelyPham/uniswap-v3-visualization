import { createAction } from '@reduxjs/toolkit';
import { PoolData, PoolStatusState } from './reducer';

// pool detail info
export const updatePoolData = createAction<{ pools: PoolData[] }>(
  'pools/updatePoolData',
);

// add pool address to byAddress
export const addPoolKeys = createAction<{ poolAddresses: string[] }>(
  'pool/addPoolKeys',
);

export const refreshPool = createAction('pools/refreshPool');

export const updatePoolStatus = createAction<{
  status: PoolStatusState;
}>('pools/updatePoolStatus');
