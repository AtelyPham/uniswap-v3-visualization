export interface PoolTableData {
  pool: string;
  tvl: string;
  volume1h: string;
  volume24h: string;
  volume7d: string;
  id: number;
}

export interface PoolTableProps {
  data: ReadonlyArray<PoolTableData>;
}
