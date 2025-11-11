import React from 'react';
import type { CoachingSummaryData } from '../types.ts';

interface CoachingSummaryProps {
  data: CoachingSummaryData;
}

const SummaryItem: React.FC<{label: string, value: string | number}> = ({ label, value }) => (
    <div className="flex justify-between items-baseline">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold text-white text-lg">{value}</span>
    </div>
);

export const CoachingSummary: React.FC<CoachingSummaryProps> = ({ data }) => {
  const completionRate = data.totalCoachingSessions > 0 ? (data.completedSessions / data.totalCoachingSessions) * 100 : 0;
  const ackRate = data.totalCoachingSessions > 0 ? (data.acknowledgedSessions / data.totalCoachingSessions) * 100 : 0;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Coaching Funnel Summary</h3>
      <div className="space-y-4 flex-grow flex flex-col justify-center">
        <SummaryItem label="Total Coaching Sessions" value={data.totalCoachingSessions} />
        <SummaryItem label="Completed by Agent" value={data.completedSessions} />
        <SummaryItem label="Acknowledged by Agent" value={data.acknowledgedSessions} />
        <SummaryItem label="Avg. Time to Complete" value={`${data.avgTimeToComplete.toFixed(1)} days`} />
        
        <div className="pt-4 space-y-3">
            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-blue-400">Completion Rate</span>
                    <span className="text-sm font-medium text-blue-400">{completionRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{width: `${completionRate}%`}}></div>
                </div>
            </div>
            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-green-400">Acknowledgment Rate</span>
                    <span className="text-sm font-medium text-green-400">{ackRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${ackRate}%`}}></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};