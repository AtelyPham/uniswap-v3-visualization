import { PoolData } from 'state/pools/reducer';

export interface PoolTableData extends PoolData {
  id?: number;
}

export interface PoolTableProps {
  poolsData: ReadonlyArray<PoolTableData>;
  itemsPerPage?: number;
}
