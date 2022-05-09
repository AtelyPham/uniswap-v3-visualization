import classNames from 'classnames';
import { Table } from 'components/Table';
import React, { useMemo } from 'react';
import {
  Column,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import {
  formatAmount,
  formatDollarAmount,
  formatTime,
  getEtherscanLink,
  shortenAddress,
} from 'utils';
import { ExternalLink } from '../ExternalLink';
import { DefaultColumnFilter, TransactionFilter } from './filters';
import TransactionNameCell from './TransactionNameCell';
import { TransactioniTableProps } from './TransactionTable.props';

const TransactionTable: React.FC<TransactioniTableProps> = ({
  transactionsData,
  itemsPerPage = 10,
}) => {
  const data = useMemo(
    () =>
      transactionsData.map((tx, idx) => {
        tx['id'] = idx + 1;
        return tx;
      }),
    [transactionsData],
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  );

  const responsiveClassName = 'lg:inline-block lg:w-full';
  const hiddenClassName = classNames('hidden', responsiveClassName);

  const textLeft = classNames(responsiveClassName, 'text-left');

  const textRight = classNames(responsiveClassName, 'text-center');
  const hiddenTextRight = classNames(hiddenClassName, 'text-center');

  const columns = useMemo<ReadonlyArray<Column>>(
    () => [
      {
        Header: '',
        accessor: 'type',
        accessorHash: 'hash',
        accessorToken0Symbol: 'token0Symbol',
        accessorToken1Symbol: 'token1Symbol',
        accessorAmountToken0: 'amountToken0',
        accessorAmountToken1: 'amountToken1',
        Cell: args => <TransactionNameCell className={textLeft} {...args} />,
        Filter: args => <TransactionFilter {...args} />,
        disableSortBy: true,
      },
      {
        Header: () => {
          return <span className={textRight}>Total value</span>;
        },
        Cell: ({ value }: { value: number }) => (
          <span className={textRight}>{formatDollarAmount(value)}</span>
        ),
        accessor: 'amountUSD',
        disableFilters: true,
      },
      {
        Header: () => <span className={hiddenTextRight}>Token Amount</span>,
        Cell: ({
          value,
          row,
          column,
        }: {
          value: number;
          row: any;
          column: any;
        }) => {
          const symbol = row.original[column.accesorTokenSymbol];
          return (
            <span className={hiddenTextRight}>{`${formatAmount(
              value,
            )} ${symbol}`}</span>
          );
        },
        accessor: 'amountToken0',
        accesorTokenSymbol: 'token0Symbol',
        disableFilters: true,
      },
      {
        Header: () => <span className={hiddenTextRight}>Token Amount</span>,
        Cell: ({
          value,
          row,
          column,
        }: {
          value: number;
          row: any;
          column: any;
        }) => {
          const symbol = row.original[column.accesorTokenSymbol];
          return (
            <span className={hiddenTextRight}>{`${formatAmount(
              value,
            )} ${symbol}`}</span>
          );
        },
        accessor: 'amountToken1',
        accesorTokenSymbol: 'token1Symbol',
        disableFilters: true,
      },
      {
        Header: () => <span className={hiddenTextRight}>Account</span>,
        Cell: ({ value }: { value: string }) => {
          return (
            <span className={hiddenTextRight}>
              <ExternalLink href={getEtherscanLink(value, 'address')}>
                {shortenAddress(value)}
              </ExternalLink>
            </span>
          );
        },
        accessor: 'sender',
        disableFilters: true,
      },
      {
        Header: () => <span className={hiddenTextRight}>Time</span>,
        Cell: ({ value }: { value: string }) => (
          <span className={hiddenTextRight}>{formatTime(value)}</span>
        ),
        accessor: 'timestamp',
        disableFilters: true,
      },
    ],
    [],
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: itemsPerPage },
      defaultColumn,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  return (
    <Table tableInstance={tableInstance} canSortable={true} canFilter={true} />
  );
};

export default TransactionTable;
