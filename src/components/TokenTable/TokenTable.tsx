import classNames from 'classnames';
import { Percent } from 'components/Percent';
import { Table } from 'components/Table';
import { TokenLogo } from 'components/TokenLogo';
import React, { useMemo } from 'react';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import { formatDollarAmount } from 'utils';
import { TokenTableProps } from './TokenTable.props';

const TokenCell = ({
  value,
  row,
  column,
  className,
}: {
  value: string;
  row: any;
  column: any;
  className: string;
}) => {
  const name = value;
  const symbol: string = row.original[column.accessorSymbol];
  const address: string = row.original[column.accessorAddress];

  return (
    <span className={className}>
      <div className="flex items-center">
        <span className="inline-block mr-1">
          <TokenLogo address={address} symbol={symbol} />
        </span>
        {name} &nbsp;<span className="text-gray-400">({symbol})</span>
      </div>
    </span>
  );
};

const TokenTable: React.FC<TokenTableProps> = ({
  tokensData,
  itemsPerPage = 10,
}) => {
  const data = useMemo(
    () =>
      tokensData.map((token, idx) => {
        token.id = idx + 1;
        return token;
      }),
    [tokensData],
  );

  const responsiveClassName = 'sm:inline-block sm:w-full';
  const hiddenClassName = classNames('hidden', responsiveClassName);
  const columns = useMemo<ReadonlyArray<Column>>(
    () => [
      {
        Header: () => <span className={hiddenClassName}>#</span>,
        Cell: ({ value }: { value: any }) => (
          <span className={hiddenClassName}>{value}</span>
        ),
        accessor: 'id',
        disableSortBy: true,
      },
      {
        Header: () => (
          <span className={classNames(responsiveClassName, 'text-left')}>
            Name
          </span>
        ),
        Cell: args => (
          <TokenCell
            className={classNames(responsiveClassName, 'text-left')}
            {...args}
          />
        ),
        accessor: 'name',
        accessorSymbol: 'symbol',
        accessorAddress: 'address',
      },
      {
        Header: () => (
          <span className={classNames(responsiveClassName, 'text-right')}>
            Price
          </span>
        ),
        Cell: ({ value }: { value: number }) => (
          <span className={classNames(hiddenClassName, 'text-right')}>
            {formatDollarAmount(value)}
          </span>
        ),
        accessor: 'priceUSD',
      },
      {
        Header: () => (
          <span className={classNames(responsiveClassName, 'text-right')}>
            Price Change
          </span>
        ),
        Cell: ({ value }: { value: number }) => (
          <span className={classNames(responsiveClassName, 'text-right')}>
            <Percent value={value} />
          </span>
        ),
        accessor: 'priceUSDChange',
      },
      {
        Header: () => (
          <span className={classNames(responsiveClassName, 'text-right')}>
            Volume 24h
          </span>
        ),
        Cell: ({ value }: { value: number }) => (
          <span className={classNames(responsiveClassName, 'text-right')}>
            {formatDollarAmount(value)}
          </span>
        ),
        accessor: 'volumeUSD',
      },
      {
        Header: () => (
          <span className={classNames(responsiveClassName, 'text-right')}>
            tvl
          </span>
        ),
        Cell: ({ value }: { value: number }) => (
          <span className={classNames(responsiveClassName, 'text-right')}>
            {formatDollarAmount(value)}
          </span>
        ),
        accessor: 'tvlUSD',
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

export default TokenTable;
