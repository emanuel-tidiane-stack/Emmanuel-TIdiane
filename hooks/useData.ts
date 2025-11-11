import { useState, useEffect, useCallback } from 'react';
import type { DashboardData } from '../types.ts';
import { fetchData, processData } from '../services/dataService.ts';

// Default to the last 30 days
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const today = new Date();

export const useData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: thirtyDaysAgo, end: today });

  const loadData = useCallback(async (currentDateRange: { start: Date, end: Date }) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, the date range would be passed to the API.
      // Here, we fetch all data then process it based on the range.
      await new Promise(resolve => setTimeout(resolve, 1000));
      const rawData = fetchData(); // Fetches all historical data
      const processed = processData(rawData, currentDateRange.start, currentDateRange.end);
      setData(processed);
    } catch (err) {
      setError('Failed to fetch or process data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]); // Reruns when dateRange changes

  const refreshData = useCallback(() => {
    loadData(dateRange);
  }, [loadData, dateRange]);

  return { data, loading, error, refreshData, dateRange, setDateRange };
};