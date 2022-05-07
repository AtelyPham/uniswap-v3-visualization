import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import useBlockClient from './useBlockClient';
import useDataClient from './useDataClient';

export default (): {
  dataClient: ApolloClient<NormalizedCacheObject>;
  blockClient: ApolloClient<NormalizedCacheObject>;
} => {
  const dataClient = useDataClient();
  const blockClient = useBlockClient();

  return { dataClient, blockClient };
};
