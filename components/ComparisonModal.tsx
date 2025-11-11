import React from 'react';
import type { AgentRiskProfile } from '../types.ts';
import { MetricCard } from './MetricCard.tsx';
import { AgentTrendChart } from './AgentTrendChart.tsx';

interface ComparisonModalProps {
  agents: [AgentRiskProfile, AgentRiskProfile];
  onClose: () => void;
}

const AgentColumn: React.FC<{ agent: AgentRiskProfile }> = ({ agent }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-center text-white">{agent.agentName}</h3>
        <div className="grid grid-cols-2 gap-4">
            <MetricCard title="Risk Score" value={agent.riskScore} />
            <MetricCard title="Completion Rate" value={`${(agent.completionRate * 100).toFixed(0)}%`} />
        </div>
        <div className="h-64 bg-gray-900/50 p-2 rounded-lg">
            <AgentTrendChart data={agent.historicalData} weeksOfHistory={8} />
        </div>
    </div>
);


export const ComparisonModal: React.FC<ComparisonModalProps> = ({ agents, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Agent Comparison</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 divide-x-0 md:divide-x md:divide-gray-700">
            <AgentColumn agent={agents[0]} />
            <div className="pl-0 md:pl-6">
                <AgentColumn agent={agents[1]} />
            </div>
        </div>
      </div>
    </div>
  );
};