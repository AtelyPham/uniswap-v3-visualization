import { Card, NetworkSummary, PoolTable, TokenTable } from 'components';
import { TransactionTable } from 'components/TransactionTable';
import { cloneDeep } from 'lodash';
import React, { useMemo } from 'react';
import { useNetworkData } from 'state/network/hooks';
import { usePoolsState, useRefreshPool } from 'state/pools/hooks';
import { PoolData } from 'state/pools/reducer';
import { useRefreshToken, useTokensState } from 'state/tokens/hooks';
import { TokenData } from 'state/tokens/reducer';
import {
  useRefreshTransaction,
  useTransactionState,
} from 'state/transactions/hooks';

function App() {
  const [networkData] = useNetworkData();

  const poolsState = usePoolsState();
  const { status: poolStatus } = poolsState;
  const poolsData = useMemo(() => {
    return Object.values(poolsState.byAddress)
      .map(p => cloneDeep(p.data))
      .filter((p): p is PoolData => Boolean(p));
  }, [poolsState]);
  const refreshPool = useRefreshPool();

  const tokensState = useTokensState();
  const { status: tokenStatus } = tokensState;
  const tokensData = useMemo(() => {
    return Object.values(tokensState.byAddress)
      .map(t => cloneDeep(t.data))
      .filter((t): t is TokenData => Boolean(t));
  }, [tokensState]);
  const refreshToken = useRefreshToken();

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
          <NetworkSummary data={networkData} />
          <Card
            title="Top pools"
            isLoading={
              poolStatus.loading ||
              poolsState.lastUpdated === undefined ||
              !poolsData.length
            }
            onRefresh={() => refreshPool()}
          >
            <PoolTable poolsData={poolsData} />
          </Card>
          <Card
            title="Top tokens"
            isLoading={tokenStatus.loading || !tokensData.length}
            onRefresh={() => refreshToken()}
          >
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
      <footer className="p-4 rounded-lg shadow md:px-6 md:py-8">
        <hr className="my-6 border-gray-400 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2022. Make with ❤️ by{' '}
          <a
            href="https://github.com/AtelyPham"
            className="hover:underline text-blue-400"
            target="_blank"
            rel="noreferrer"
          >
            Trung-Tin Pham
          </a>
          .
        </span>
      </footer>
    </div>
  );
}

export default App;
