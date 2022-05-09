import classNames from 'classnames';
import React from 'react';
import { ExternalLink } from 'components';
import { TransactionType } from 'state/transactions/reducer';
import { getEtherscanLink } from 'utils';

export interface TransactionNameCellProps {
  value: TransactionType;
  column: any;
  row: any;
  className: string;
  [key: string]: any;
}

const TransactionNameCell: React.FC<TransactionNameCellProps> = ({
  value,
  column,
  row,
  className,
}) => {
  const type = value;
  const hash = row.original[column.accessorHash];
  const token0Symbol = row.original[column.accessorToken0Symbol];
  const token1Symbol = row.original[column.accessorToken1Symbol];
  const amountToken0 = row.original[column.accessorAmountToken0];
  const amountToken1 = row.original[column.accessorAmountToken1];

  const outputTokenSymbol = amountToken0 < 0 ? token0Symbol : token1Symbol;
  const inputTokenSymbol = amountToken1 < 0 ? token0Symbol : token1Symbol;

  return (
    <span className={classNames(className)}>
      <ExternalLink href={getEtherscanLink(hash, 'transaction')}>
        {type === TransactionType.MINT
          ? `Add ${token0Symbol} and ${token1Symbol} `
          : type === TransactionType.SWAP
          ? `Swap ${inputTokenSymbol} for ${outputTokenSymbol} `
          : `Remove ${token0Symbol} and ${token1Symbol} `}
      </ExternalLink>
    </span>
  );
};

export default TransactionNameCell;
