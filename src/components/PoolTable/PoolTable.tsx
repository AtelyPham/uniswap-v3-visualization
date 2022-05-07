import React from 'react';
import { Column, useSortBy, useTable } from 'react-table';
import { Table } from '..';
import { PoolTableProps } from './PoolTable.props';

const PoolTable: React.FC<PoolTableProps> = ({ data }) => {
  const columns = React.useMemo<ReadonlyArray<Column>>(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
      },
      {
        Header: 'pool',
        accessor: 'pool',
      },
      {
        Header: 'tvl',
        accessor: 'tvl',
      },
      {
        Header: 'volume 1h',
        accessor: 'volume1h',
      },
      {
        Header: 'volume 24h',
        accessor: 'volume24h',
      },
      {
        Header: 'Voumn 7d',
        accessor: 'volume7d',
      },
    ],
    [],
  );

  const tableInstance = useTable<object>({ columns, data }, useSortBy);

  return (
    <div className="px-5">
      <Table tableInstance={tableInstance} canSortable={true} />
    </div>
  );
};

export default PoolTable;
