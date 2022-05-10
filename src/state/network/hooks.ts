import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, AppDispatch } from 'state';
import { updateNetworkData } from './actions';
import { NetworkData } from './reducer';

export function useNetworkData(): [
  NetworkData | undefined,
  (networkData: NetworkData) => void,
] {
  const networkData: NetworkData | undefined = useSelector(
    (state: AppState) => state.network.byNetwork.data,
  );

  const dispatch = useDispatch<AppDispatch>();
  const setNetworkData: (networkData: NetworkData) => void = useCallback(
    (networkData: NetworkData) => dispatch(updateNetworkData({ networkData })),
    [dispatch],
  );
  return [networkData, setNetworkData];
}
