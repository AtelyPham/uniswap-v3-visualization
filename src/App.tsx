import { POOLS_DATA, TOKENS_DATA, TRANSACTIONS_DATA } from 'apollo';
import { Card, PoolTable, TokenTable } from 'components';
import { TransactionTable } from 'components/TransactionTable';
import React from 'react';

function App() {
  /*   const poolsState = usePoolsState();
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
  }, [tokensState]); */

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-base sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="w-full mx-auto py-6 sm:px-6 lg:px-8 flex flex-wrap justify-around justify-items-start">
          <Card title="Top pools">
            <PoolTable poolsData={POOLS_DATA} />
          </Card>
          <Card title="Top tokens">
            <TokenTable tokensData={TOKENS_DATA} />
          </Card>
          <Card title="Transaction">
            <TransactionTable transactionsData={TRANSACTIONS_DATA} />
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
