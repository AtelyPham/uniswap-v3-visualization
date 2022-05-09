import { TokenData } from 'state/tokens/reducer';

export interface TokenTableData extends TokenData {
  id?: number;
}

export interface TokenTableProps {
  tokensData: ReadonlyArray<TokenTableData>;
  itemsPerPage?: number;
}
