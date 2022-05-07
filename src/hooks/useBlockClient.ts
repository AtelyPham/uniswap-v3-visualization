import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { blockClient } from 'apollo';

export default (): ApolloClient<NormalizedCacheObject> => {
  return blockClient;
};
