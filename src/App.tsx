import { POOLS_DATA, TOKENS_DATA } from 'apollo';
import { Card, PoolTable, TokenTable } from 'components';
import { TransactionTable } from 'components/TransactionTable';
import { cloneDeep } from 'lodash';
import React, { useMemo } from 'react';
import {
  useRefreshTransaction,
  useTransaction,
} from 'state/transactions/hooks';

function App() {
  /* const poolsState = usePoolsState();
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
 */
  const [transactions] = useTransaction();
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
          <Card title="Top pools" isLoading={!POOLS_DATA.length}>
            <PoolTable poolsData={POOLS_DATA} />
          </Card>
          <Card title="Top tokens" isLoading={!TOKENS_DATA.length}>
            <TokenTable tokensData={TOKENS_DATA} />
          </Card>
          <Card
            title="Transaction"
            isLoading={!transactionsData?.length}
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
