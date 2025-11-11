import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Corrected import path
import type { HistoricalDataPoint } from '../types.ts';

interface AgentTrendChartProps {
  data: HistoricalDataPoint[];
  weeksOfHistory: number;
}

export const AgentTrendChart: React.FC<AgentTrendChartProps> = ({ data, weeksOfHistory }) => {

  const formatXAxis = (tickItem: number) => {
    if (tickItem === weeksOfHistory) return 'This Week';
    return `Wk ${tickItem - weeksOfHistory}`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
        <XAxis 
          dataKey="week" 
          stroke="#a0aec0" 
          tickFormatter={formatXAxis}
        />
        <YAxis 
            stroke="#a0aec0" 
            domain={[0, 100]} 
            yAxisId="left"
            label={{ value: 'Rate / Score', angle: -90, position: 'insideLeft', fill: '#a0aec0' }}
        />
        <Tooltip
            contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#cbd5e0' }}
            formatter={(value: number, name: string) => [`${value}${name.includes('Rate') ? '%' : ''}`, name]}
            labelFormatter={(label) => formatXAxis(label as number)}
        />
        <Legend wrapperStyle={{color: '#e2e8f0'}} />
        <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="completionRate" 
            name="Completion Rate"
            stroke="#22c55e" 
            strokeWidth={2} 
            dot={{ r: 4 }}
            activeDot={{ r: 6 }} 
        />
        <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="acknowledgmentRate" 
            name="Ack. Rate"
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }} 
        />
        <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="riskScore" 
            name="Risk Score"
            stroke="#ef4444" 
            strokeWidth={2} 
            dot={{ r: 4 }}
            activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};