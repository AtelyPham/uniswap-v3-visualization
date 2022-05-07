import { ApolloClient, InMemoryCache } from '@apollo/client';

export * from './queries';

export const blockClient = new ApolloClient({
  uri: process.env.REACT_APP_BLOCK_URI ?? '',
  cache: new InMemoryCache(),
});

export const client = new ApolloClient({
  uri: process.env.REACT_APP_THE_GRAPH_URI ?? '',
  cache: new InMemoryCache(),
});
