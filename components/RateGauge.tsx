
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface RateGaugeProps {
  title: string;
  rate: number;
}

export const RateGauge: React.FC<RateGaugeProps> = ({ title, rate }) => {
  const percentage = Math.round(rate * 100);
  const color = percentage > 85 ? '#22c55e' : percentage > 60 ? '#f59e0b' : '#ef4444';
  const data = [{ name: title, value: percentage }];

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 h-64 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <div className="w-full h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="90%"
            data={data}
            startAngle={180}
            endAngle={-180}
            barSize={20}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
              fill={color}
              angleAxisId={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold" style={{ color }}>{percentage}%</span>
        </div>
      </div>
    </div>
  );
};
