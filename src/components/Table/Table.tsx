import React from 'react';
import { TableProps } from './Table.props';

const Table: React.FC<TableProps> = ({ tableInstance, canSortable }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table
      {...getTableProps()}
      className="min-w-full divide-y divide-gray-200 text-center"
    >
      <thead className="bg-gray-50">
        {headerGroups.map((headerGroup, idx) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
            {headerGroup.headers.map((column, idx) => (
              <th
                {...column.getHeaderProps(
                  canSortable ? column.getSortByToggleProps() : undefined,
                )}
                key={idx}
                scope="col"
                className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 md:px-4 py-1 md:py-2"
              >
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* Apply the table body props */}
      <tbody
        {...getTableBodyProps()}
        className="bg-white divide-y divide-gray-200 text-xs"
      >
        {rows.map((row, idx) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={idx}>
              {row.cells.map((cell, idx) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    className="whitespace-nowrap px-2 md:px-4 py-2 md:py-4"
                    key={idx}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
