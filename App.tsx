import React from 'react';
import { Dashboard } from './components/Dashboard.tsx';
import { Header } from './components/Header.tsx';
import { useData } from './hooks/useData.ts';

const App: React.FC = () => {
  const { data, loading, error, refreshData, dateRange, setDateRange } = useData();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header loading={loading} onRefresh={refreshData} />
      <main className="p-4 sm:p-6 lg:p-8">
        {loading && !data && (
          <div className="flex justify-center items-center h-96">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg">Loading Dashboard Data...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-96">
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded relative text-center">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          </div>
        )}
        {data && <Dashboard data={data} dateRange={dateRange} onDateChange={setDateRange} />}
      </main>
    </div>
  );
};

export default App;