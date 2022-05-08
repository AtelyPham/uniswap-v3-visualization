import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import { formatDollarAmount } from 'utils';
import { Table } from '..';
import { PoolTableProps } from './PoolTable.props';

const PoolTable: React.FC<PoolTableProps> = ({
  poolsData,
  itemsPerPage = 10,
}) => {
  const data = useMemo(
    () =>
      poolsData.map((pool, idx) => {
        pool.id = idx + 1;
        return pool;
      }),
    [poolsData],
  );

  const responsiveClassName = 'hidden sm:inline-block';
  const columns = useMemo<ReadonlyArray<Column>>(
    () => [
      {
        Header: () => <span className={responsiveClassName}>#</span>,
        Cell: ({ value }: { value: any }) => (
          <span className={responsiveClassName}>{value}</span>
        ),
        accessor: 'id',
        disableSortBy: true,
      },
      {
        Header: () => <span className="text-left">pool</span>,
        Cell: ({ value }: { value: any }) => (
          <span className="text-left">{value}</span>
        ),
        accessor: 'pool',
      },
      {
        Header: () => (
          <span className="hidden sm:inline-block text-right">tvl</span>
        ),
        Cell: ({ value }: { value: number }) => (
          <span className={classNames(responsiveClassName, 'text-right')}>
            {formatDollarAmount(value)}
          </span>
        ),
        accessor: 'tvlUSD',
      },
      {
        Header: <span className="text-right">volume 24h</span>,
        Cell: ({ value }: { value: number }) => (
          <span className="text-right">{formatDollarAmount(value)}</span>
        ),
        accessor: 'volumeUSD',
      },
      {
        Header: () => (
          <span className={classNames(responsiveClassName, 'text-right')}>
            Voumn 7d
          </span>
        ),
        Cell: ({ value }: { value: number }) => (
          <span className={classNames(responsiveClassName, 'text-right')}>
            {formatDollarAmount(value)}
          </span>
        ),
        accessor: 'volumeUSDWeek',
      },
    ],
    [],
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: itemsPerPage,
      },
    },
    useSortBy,
    usePagination,
  );

  return (
    <div className="px-5 w-full">
      <Table tableInstance={tableInstance} canSortable={true} />
    </div>
  );
};

export default PoolTable;
