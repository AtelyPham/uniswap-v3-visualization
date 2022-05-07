import { useTable } from 'react-table';

export interface TableProps {
  tableInstance: ReturnType<typeof useTable>;
  canSortable?: boolean;
}
