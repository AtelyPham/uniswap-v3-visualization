import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { addPoolKeys, updatePoolData } from './actions';
import { PoolData, PoolsState } from './reducers';

/**
 *
 * @returns the stored pool state
 * {
 *  pools: {
 *    [address: string]: PoolData,
 *    lastUpdated: number;
 *  }
 * }
 */
export function usePoolsState(): PoolsState {
  return useSelector((state: AppState) => state.pools);
}

/**
 *
 * @returns a function to add new pools to the store
 */
export function useUpdatePoolData(): (pools: PoolData[]) => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (pools: PoolData[]) => dispatch(updatePoolData({ pools })),
    [dispatch],
  );
}

/**
 *
 * @returns a function to add pool keys to the store
 */
export function useAddPoolKeys(): (addresses: string[]) => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (poolAddresses: string[]) => dispatch(addPoolKeys({ poolAddresses })),
    [dispatch],
  );
}

/**
 *
 * @param poolAddresses addresses to get pools data
 * @returns pools with stored data in redux, also add
 * address which not exists in the store
 */
export function usePoolDatas(poolAddresses: string[]): PoolData[] {
  const poolsState = usePoolsState();
  const addPoolKeys = useAddPoolKeys();

  const untrackedAddresses = poolAddresses.reduce(
    (accum: string[], address) => {
      if (!Object.keys(poolsState).includes(address)) {
        accum.push(address);
      }
      return accum;
    },
    [],
  );

  useEffect(() => {
    if (untrackedAddresses.length) {
      addPoolKeys(untrackedAddresses);
    }
    return;
  }, [addPoolKeys, untrackedAddresses]);

  // filter for pools with data
  const poolsWithData = poolAddresses
    .map(address => {
      const poolData = poolsState[address]?.data;
      return poolData ?? undefined;
    })
    .filter((pool): pool is PoolData => Boolean(pool));

  return poolsWithData;
}
