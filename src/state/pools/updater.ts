import { useUpdatePoolData, usePoolsState, useAddPoolKeys } from './hooks';
import { useEffect, useMemo } from 'react';
import { useTopPoolAddresses, usePoolData } from 'apollo';

export default (): null => {
  // updaters
  const updatePoolData = useUpdatePoolData();
  const addPoolKeys = useAddPoolKeys();

  // data
  const poolsState = usePoolsState();
  const { loading, error, addresses } = useTopPoolAddresses();

  // add top pools on first load
  useEffect(() => {
    if (addresses && !error && !loading) {
      addPoolKeys(addresses);
    }
  }, [addPoolKeys, addresses, error, loading]);

  // detect for which addresses we havent loaded pool data yet
  const unfetchedPoolAddresses = useMemo(() => {
    return Object.keys(poolsState.byAddress).reduce((accum: string[], key) => {
      const poolData = poolsState.byAddress[key];
      if (!poolData.data || !poolData.lastUpdated) {
        accum.push(key);
      }
      return accum;
    }, []);
  }, [poolsState, poolsState.byAddress]);

  // update unloaded pool entries with fetched data
  const {
    error: poolDataError,
    loading: poolDataLoading,
    data: poolDatas,
  } = usePoolData(unfetchedPoolAddresses);

  useEffect(() => {
    if (
      poolDatas &&
      Object.values(poolDatas).length &&
      !poolDataError &&
      !poolDataLoading
    ) {
      updatePoolData(Object.values(poolDatas));
    }
  }, [poolDataError, poolDataLoading, poolDatas, updatePoolData]);

  return null;
};
