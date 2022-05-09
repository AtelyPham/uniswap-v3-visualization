import { useLazyPoolData, useLazyTopPoolAddresses } from 'apollo';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import {
  addPoolKeys,
  refreshPool,
  updatePoolData,
  updatePoolStatus,
} from './actions';
import { PoolData, PoolsState, PoolStatusState } from './reducer';

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
/**
 *
 *
 * @returns a tuple in which the first element is
 * current pool status state store in redux.
 * The second element is a function to update the store
 */
export function usePoolStatus(): [
  PoolStatusState,
  (status: PoolStatusState) => void,
] {
  const status = useSelector((state: AppState) => state.pools.status);

  const dispatch = useDispatch<AppDispatch>();
  const setPoolStatusState = useCallback(
    (status: PoolStatusState) => dispatch(updatePoolStatus({ status })),
    [dispatch],
  );

  return [status, setPoolStatusState];
}

/**
 *
 * @returns a function to fetch latest pools
 * and udpate to redux store
 *
 */
export function useRefreshPool(): () => Promise<void> {
  const dispatch = useDispatch<AppDispatch>();

  const updatePoolData = useUpdatePoolData();
  const addPoolKeys = useAddPoolKeys();

  const fetchPoolAddresses = useLazyTopPoolAddresses();
  const fetchTransactions = useLazyPoolData();
  const [, setStatus] = usePoolStatus();

  // Function to refresh transactions in the store
  const refreshStore = useCallback(() => dispatch(refreshPool()), [dispatch]);

  return useCallback(async () => {
    setStatus({ loading: true, error: undefined });

    refreshPool();

    const { data: addresses } = await fetchPoolAddresses();
    if (!addresses) {
      setStatus({ loading: false, error: true });
      return;
    }

    const { data } = await fetchTransactions(addresses);
    if (!data) {
      setStatus({ loading: false, error: true });
      return;
    }

    addPoolKeys(addresses);
    updatePoolData(Object.values(data));

    setStatus({ loading: false });
  }, [refreshStore]);
}
