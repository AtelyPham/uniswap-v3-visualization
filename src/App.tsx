import { cloneDeep } from '@apollo/client/utilities';
import { POOLS_DATA } from 'apollo';
import { PoolTable } from 'components';
import { Card } from 'components';
import React, { useMemo } from 'react';
import { usePoolsState } from 'state/pools/hooks';
import { PoolData } from 'state/pools/reducer';

function App() {
  const poolsState = usePoolsState();

  const poolsData = useMemo(() => {
    return Object.values(poolsState)
      .map(p => cloneDeep(p.data))
      .filter((p): p is PoolData => Boolean(p));
  }, [poolsState]);

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
          <Card title="Top pools" isLoading={!poolsData.length}>
            <PoolTable poolsData={POOLS_DATA} />
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
