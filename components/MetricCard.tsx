
import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="mt-2 text-4xl font-bold text-white">{value}</p>
    </div>
  );
};
