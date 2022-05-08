import { usePoolData, useTopPoolAddresses } from 'apollo';
import React from 'react';

function App() {
  const { addresses } = useTopPoolAddresses();
  usePoolData(addresses ?? []);

  // const poolsData = useMemo(
  //   () => (data ? Object.values(data).filter(Boolean) : []),
  //   [data],
  // );

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
          {/* <PoolTable poolsData={poolsData} /> */}
        </div>
      </main>
    </div>
  );
}

export default App;
