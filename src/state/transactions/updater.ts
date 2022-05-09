import { useTransactionData } from 'apollo/queries/tranactions';
import { useEffect } from 'react';
import { useTransaction } from './hooks';

export default () => {
  const [transactions, setTransactions] = useTransaction();

  // Fetch and get data
  const txData = useTransactionData();

  useEffect(() => {
    if (!transactions && txData) {
      setTransactions(txData);
    }
  }, [txData, transactions, setTransactions]);

  return null;
};
