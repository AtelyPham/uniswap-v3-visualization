import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { client } from 'apollo';

export default (): ApolloClient<NormalizedCacheObject> => {
  return client;
};
