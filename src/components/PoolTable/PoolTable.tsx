import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import { PoolDataToken } from 'state/pools/reducer';
import { feeTierPercent, formatDollarAmount } from 'utils';
import { Table } from '..';
import { TokenLogo } from '../TokenLogo';
import { PoolTableProps } from './PoolTable.props';

const PoolCell = ({
  value,
  row,
  column,
  className,
}: {
  value: number;
  row: any;
  column: any;
  className: string;
}) => {
  const feeTier = value;
  const token0: PoolDataToken = row.original[column.accessorToken0];
  const token1: PoolDataToken = row.original[column.accessorToken1];
  return (
    <span className={className}>
      <div className="flex items-center">
        <span className="flex mr-0.5">
          <TokenLogo address={token0.address} symbol={token0.symbol} />
          <TokenLogo address={token1.address} symbol={token1.symbol} />
        </span>
        {token0.symbol}/{token1.symbol}
        <span className="inline-block ml-2 w-fit py-0.5 px-1 bg-gray-600 text-white rounded-lg font-medium text-xs">
          {feeTierPercent(feeTier)}
        </span>
      </div>
    </span>
  );
};

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

  const commonClassnames = classNames('py-1 sm:py-2');
  const responsiveClassName = 'sm:inline';
  const hiddenClassName = classNames('hidden', responsiveClassName);
  const columns = useMemo<ReadonlyArray<Column>>(
    () => [
      {
        Header: () => (
          <span className={classNames(commonClassnames, hiddenClassName)}>
            #
          </span>
        ),
        Cell: ({ value }: { value: any }) => (
          <span className={hiddenClassName}>{value}</span>
        ),
        accessor: 'id',
        disableSortBy: true,
      },
      {
        Header: () => (
          <span className={classNames(commonClassnames, responsiveClassName)}>
            pool
          </span>
        ),
        Cell: args => (
          <PoolCell className={classNames(responsiveClassName)} {...args} />
        ),
        accessor: 'feeTier',
        accessorToken0: 'token0',
        accessorToken1: 'token1',
      },
      {
        Header: () => <span className={classNames(hiddenClassName)}>tvl</span>,
        Cell: ({ value }: { value: number }) => (
          <span className={classNames(hiddenClassName)}>
            {formatDollarAmount(value)}
          </span>
        ),
        accessor: 'tvlUSD',
      },
      {
        Header: (
          <span className={classNames(responsiveClassName)}>volume 24h</span>
        ),
        Cell: ({ value }: { value: number }) => (
          <span className={classNames(responsiveClassName)}>
            {formatDollarAmount(value)}
          </span>
        ),
        accessor: 'volumeUSD',
      },
      {
        Header: () => (
          <span className={classNames(hiddenClassName)}>Voumn 7d</span>
        ),
        Cell: ({ value }: { value: number }) => (
          <span className={classNames(hiddenClassName)}>
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

  return <Table tableInstance={tableInstance} canSortable={true} />;
};

export default PoolTable;
