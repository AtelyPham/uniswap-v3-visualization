import React from 'react';
import { ColumnInstance } from 'react-table';
import { TransactionType } from 'state/transactions/reducer';

export const DefaultColumnFilter: React.FC<{ column: ColumnInstance }> = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

export const TransactionFilter: React.FC<{ column: ColumnInstance }> = ({
  column: { filterValue, preFilteredRows, setFilter, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set<string>();
    preFilteredRows.forEach(row => {
      options.add(row.values[id] as string);
    });
    return [...Array.from(options)];
  }, [id, preFilteredRows]);

  return (
    <div className="pl-2 md:pl-4 my-1">
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 font-medium"
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {parseInt(option) === TransactionType.SWAP
              ? 'Swap'
              : parseInt(option) === TransactionType.MINT
              ? 'Mint'
              : parseInt(option) === TransactionType.BURN
              ? 'Burn'
              : 'All'}
          </option>
        ))}
      </select>
    </div>
  );
};
