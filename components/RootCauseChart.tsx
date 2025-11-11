import React from 'react';
// FIX: Corrected import path
import type { RootCause } from '../types.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RootCauseChartProps {
  data: RootCause[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e'];

export const RootCauseChart: React.FC<RootCauseChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-96">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Root Cause Frequency</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          <XAxis type="number" stroke="#a0aec0" />
          <YAxis dataKey="name" type="category" stroke="#a0aec0" width={100} tick={{fontSize: 12}} />
          <Tooltip 
            cursor={{fill: 'rgba(128, 128, 128, 0.2)'}}
            contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }}
          />
          <Bar dataKey="count" name="Count" fill="#3b82f6" barSize={20}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};