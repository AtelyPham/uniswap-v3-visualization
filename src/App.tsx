import { useQuery } from '@apollo/client';
import React from 'react';
import {
  GetAllPoolsQuery,
  GetAllPoolsQueryVariables,
  OrderDirection,
  Pool_OrderBy,
} from './@types/graphql.d';
import { GET_ALL_POOLS } from './apollo';

function App() {
  const { data, loading, error } = useQuery<
    GetAllPoolsQuery,
    GetAllPoolsQueryVariables
  >(GET_ALL_POOLS, {
    variables: {
      first: 3,
      orderBy: Pool_OrderBy.TotalValueLockedUsd,
      orderDirection: OrderDirection.Desc,
    },
    fetchPolicy: 'cache-and-network',
  });

  console.log({
    data,
    loading,
    error,
  });

  return (
    <div data-testid="graph-protocol" className="w-3/4 break-all">
      Hello world
    </div>
  );
}

export default App;
