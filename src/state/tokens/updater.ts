import { useEffect, useMemo } from 'react';
import { useTokenData, useTopTokenAddresses } from 'apollo';
import { useAddTokenKeys, useTokensState, useUpdateTokenData } from './hooks';

export default (): null => {
  // updaters
  const updateTokenData = useUpdateTokenData();
  const addTokenKeys = useAddTokenKeys();

  // data
  const tokensState = useTokensState();
  const { loading, error, addresses } = useTopTokenAddresses();

  // add top tokens on first load
  useEffect(() => {
    if (addresses && !error && !loading) {
      addTokenKeys(addresses);
    }
  }, [addTokenKeys, addresses, error, loading]);

  // detect for which addresses we havent load token data yet
  const unfetchedTokenAddresses = useMemo(() => {
    return Object.keys(tokensState).reduce((accum: string[], key) => {
      const tokenData = tokensState[key];
      if (!tokenData.data || !tokenData.lastUpdated) {
        accum.push(key);
      }
      return accum;
    }, []);
  }, [tokensState]);

  // update unloaded pool entries with fetched data
  const {
    error: tokenDataError,
    loading: tokenDataLoading,
    data: tokenDatas,
  } = useTokenData(unfetchedTokenAddresses);

  useEffect(() => {
    if (
      tokenDatas &&
      Object.values(tokenDatas).length &&
      !tokenDataError &&
      !tokenDataLoading
    ) {
      updateTokenData(Object.values(tokenDatas));
    }
  }, [tokenDataError, tokenDataLoading, tokenDatas, updateTokenData]);

  return null;
};
