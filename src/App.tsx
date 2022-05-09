import { Card, PoolTable, TokenTable } from 'components';
import { TransactionTable } from 'components/TransactionTable';
import { cloneDeep } from 'lodash';
import React, { useMemo } from 'react';
import { usePoolsState } from 'state/pools/hooks';
import { PoolData } from 'state/pools/reducer';
import { useTokensState } from 'state/tokens/hooks';
import { TokenData } from 'state/tokens/reducer';
import {
  useRefreshTransaction,
  useTransactionState,
} from 'state/transactions/hooks';

function App() {
  const poolsState = usePoolsState();
  const poolsData = useMemo(() => {
    return Object.values(poolsState)
      .map(p => cloneDeep(p.data))
      .filter((p): p is PoolData => Boolean(p));
  }, [poolsState]);

  const tokensState = useTokensState();
  const tokensData = useMemo(() => {
    return Object.values(tokensState)
      .map(t => cloneDeep(t.data))
      .filter((t): t is TokenData => Boolean(t));
  }, [tokensState]);

  const {
    byNetwork: { lastUpdate, transactions },
    status,
  } = useTransactionState();

  const transactionsData = useMemo(() => {
    if (!transactions) {
      return [];
    }
    return cloneDeep(transactions);
  }, [transactions]);
  const refreshTx = useRefreshTransaction();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-base sm:text-3xl font-bold text-gray-600">
            Uniswap Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="w-full mx-auto py-6 sm:px-6 lg:px-8 flex flex-wrap justify-around justify-items-start">
          <Card title="Top pools" isLoading={!poolsData.length}>
            <PoolTable poolsData={poolsData} />
          </Card>
          <Card title="Top tokens" isLoading={!tokensData.length}>
            <TokenTable tokensData={tokensData} />
          </Card>
          <Card
            title="Transaction"
            isLoading={status.loading || lastUpdate === undefined}
            isError={status.error}
            onRefresh={() => refreshTx()}
          >
            <TransactionTable transactionsData={transactionsData} />
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
