import { useLazyTokenData, useLazyTopTopTokenAddresses } from 'apollo';
import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import {
  addTokenKeys,
  refreshToken,
  updateTokenData,
  updateTokenStatus,
} from './actions';
import { TokenData, TokensState, TokenStatusState } from './reducer';

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

/**
 *
 *
 * @returns a tuple in which the first element is
 * current token status state store in redux.
 * The second element is a function to update the store
 */
export function useTokenStatus(): [
  TokenStatusState,
  (state: TokenStatusState) => void,
] {
  const status = useSelector((state: AppState) => state.tokens.status);

  const dispatch = useDispatch<AppDispatch>();
  const setTokenStatusState = useCallback(
    (status: TokenStatusState) => dispatch(updateTokenStatus({ status })),
    [dispatch],
  );

  return [status, setTokenStatusState];
}

/**
 *
 * @returns a function to fetch latest pools
 * and udpate to redux store
 *
 */
export function useRefreshToken(): () => Promise<void> {
  const dispatch = useDispatch<AppDispatch>();

  const updateTokenData = useUpdateTokenData();
  const addTokenKeys = useAddTokenKeys();

  const fetchTokenAddresses = useLazyTopTopTokenAddresses();
  const fetchTokens = useLazyTokenData();
  const [, setStatus] = useTokenStatus();

  // Function to refresh transactions in the store
  const refreshStore = useCallback(() => dispatch(refreshToken()), [dispatch]);

  return useCallback(async () => {
    setStatus({ loading: true, error: undefined });

    refreshToken();

    const addresses = await fetchTokenAddresses();
    if (!addresses) {
      setStatus({ loading: false, error: true });
      return;
    }

    const { data } = await fetchTokens(addresses);
    if (!data) {
      setStatus({ loading: false, error: true });
      return;
    }

    addTokenKeys(addresses);
    updateTokenData(Object.values(data));

    setStatus({ loading: false });
  }, [refreshStore]);
}
