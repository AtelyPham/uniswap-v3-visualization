import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { addPoolKeys, updatePoolData } from './actions';
import { PoolData, PoolsState } from './reducer';

/**
 *
 * @returns the stored pool data
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
