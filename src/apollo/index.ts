import { ApolloClient, InMemoryCache } from '@apollo/client';

export * from './queries';

export const client = new ApolloClient({
  uri: process.env.REACT_APP_THE_GRAPH_URI ?? '',
  cache: new InMemoryCache(),
});
