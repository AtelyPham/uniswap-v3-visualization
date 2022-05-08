import { PoolData } from 'state/pools/reducers';

export interface PoolTableData extends PoolData {
  id?: number;
}

export interface PoolTableProps {
  poolsData: ReadonlyArray<PoolTableData>;
  itemsPerPage?: number;
}
