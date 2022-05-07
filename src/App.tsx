import { usePoolData, useTopPoolAddresses } from 'apollo';
import React from 'react';

function App() {
  const { addresses } = useTopPoolAddresses();
  const { data, error, loading } = usePoolData(addresses ?? []);

  console.log(data);
  console.log(error);
  console.log(loading);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-wrap justify-around justify-items-start">
          {/* <PoolTableContainer /> */}
        </div>
      </main>
    </div>
  );
}

export default App;
