import { useFetchNetworkData } from 'apollo';
import { useEffect } from 'react';
import { useNetworkData } from './hooks';

export default function Updater(): null {
  const [networkData, updateNetworkData] = useNetworkData();
  const { data: fetchedNetworkData, error, loading } = useFetchNetworkData();

  // update overview data if available and not set
  useEffect(() => {
    if (networkData === undefined && fetchedNetworkData && !loading && !error) {
      updateNetworkData(fetchedNetworkData);
    }
  }, [error, fetchedNetworkData, loading, networkData, updateNetworkData]);

  return null;
}
