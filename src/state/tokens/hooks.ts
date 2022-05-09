import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { addTokenKeys, updateTokenData } from './actions';
import { TokenData, TokensState } from './reducer';

/**
 *
 * @returns the stored token data
 */
export function useTokensState(): TokensState {
  return useSelector((state: AppState) => state.tokens);
}

/**
 *
 * @returns a function to add new tokens to the store
 */
export function useUpdateTokenData(): (tokens: TokenData[]) => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (tokens: TokenData[]) => dispatch(updateTokenData({ tokens })),
    [dispatch],
  );
}

/**
 *
 * @returns a function to add token keys to the store
 */
export function useAddTokenKeys(): (addresses: string[]) => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (tokenAddresses: string[]) => dispatch(addTokenKeys({ tokenAddresses })),
    [dispatch],
  );
}

/**
 *
 * @param tokenAddresses addresses to get tokens data
 * @returns tokens stored data in redux, also add
 * address which not exists in the store
 */
export function useTokenDatas(tokenAddresses: string[]): TokenData[] {
  const tokensState = useTokensState();
  const addTokenKeys = useAddTokenKeys();

  const untrackedAddresses = tokenAddresses.reduce(
    (accum: string[], address) => {
      if (!Object.keys(tokensState.byAddress).includes(address)) {
        accum.push(address);
      }
      return accum;
    },
    [],
  );

  useEffect(() => {
    if (untrackedAddresses.length) {
      addTokenKeys(untrackedAddresses);
    }
  }, [addTokenKeys, untrackedAddresses]);

  // filter for tokens with data
  const tokensWithData = tokenAddresses
    .map(address => {
      const tokenData = tokensState.byAddress[address]?.data;
      return tokenData ?? undefined;
    })
    .filter((token): token is TokenData => Boolean(token));

  return tokensWithData;
}
