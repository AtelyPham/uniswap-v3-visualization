import { TransactionData } from 'state/transactions/reducer';

export interface TransactionTableData extends TransactionData {
  id?: number;
}

export interface TransactioniTableProps {
  transactionsData: ReadonlyArray<TransactionTableData>;
  itemsPerPage?: number;
}
