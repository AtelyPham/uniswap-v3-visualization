import { gql } from '@apollo/client';

export const GET_ALL_POOLS = gql`
  query GetAllPools(
    $first: Int
    $orderBy: Pool_orderBy
    $orderDirection: OrderDirection
  ) {
    pools(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      totalValueLockedETH
      totalValueLockedUSD
    }
  }
`;
