import { createAction } from '@reduxjs/toolkit';
import { TokenData } from './reducer';

// protocol wide info
export const updateTokenData = createAction<{
  tokens: TokenData[];
}>('tokens/updateTokenData');

// add token address to byAddress
export const addTokenKeys = createAction<{
  tokenAddresses: string[];
}>('tokens/addTokenKeys');
