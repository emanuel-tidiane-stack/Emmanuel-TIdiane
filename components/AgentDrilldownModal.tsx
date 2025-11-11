import React from 'react';
import type { AgentRiskProfile } from '../types.ts';
import { AgentTrendChart } from './AgentTrendChart.tsx';
import { MetricCard } from './MetricCard.tsx';
import { AICoachingCopilot } from './AICoachingCopilot.tsx';

interface AgentDrilldownModalProps {
  agent: AgentRiskProfile;
  onClose: () => void;
}

export const AgentDrilldownModal: React.FC<AgentDrilldownModalProps> = ({ agent, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10 flex justify-between items-start border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">{agent.agentName}</h2>
            <p className="text-gray-400">Manager: {agent.managerName} | Team: {agent.team}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard title="Risk Score" value={agent.riskScore} />
                <MetricCard title="Completion Rate" value={`${(agent.completionRate * 100).toFixed(0)}%`} />
                <MetricCard title="Ack. Rate" value={`${(agent.acknowledgmentRate * 100).toFixed(0)}%`} />
                <MetricCard title="Incomplete Feedbacks" value={agent.incompleteFeedbacks} />
            </div>
          <div className="h-80 bg-gray-900/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">8-Week Performance Trend</h3>
            <AgentTrendChart data={agent.historicalData} weeksOfHistory={8} />
          </div>
          <AICoachingCopilot agent={agent} />
        </div>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
          .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        `}</style>
    </div>
  );
};