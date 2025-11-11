import React from 'react';
import type { ManagerMetrics, AgentRiskProfile } from '../types.ts';
import { MetricCard } from './MetricCard.tsx';

interface ManagerDrilldownModalProps {
  manager: ManagerMetrics;
  agents: AgentRiskProfile[];
  onClose: () => void;
}

export const ManagerDrilldownModal: React.FC<ManagerDrilldownModalProps> = ({ manager, agents, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10 flex justify-between items-center border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Manager: {manager.managerName}</h2>
            <p className="text-gray-400">Team Performance Overview</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard title="Team Size" value={manager.teamSize} />
                <MetricCard title="Team Avg. Risk" value={manager.teamAvgRiskScore.toFixed(1)} />
                <MetricCard title="Team Completion Rate" value={`${(manager.completionRate * 100).toFixed(0)}%`} />
                <MetricCard title="Coaching Depth" value={manager.coachingDepthIndex.toFixed(2)} />
            </div>
            <div>
              {/* A simplified, non-interactive version of AgentRiskTable */}
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Team Roster by Risk</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Agent</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Risk Score</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Risk Change</th>
                            </tr>
                        </thead>
                        <tbody>
                        {[...agents].sort((a,b) => b.riskScore - a.riskScore).map(agent => (
                            <tr key={agent.agentId} className="border-b border-gray-700">
                                <td className="px-4 py-2 text-sm text-white">{agent.agentName}</td>
                                <td className="px-4 py-2 text-sm text-gray-300">{agent.riskScore}</td>
                                <td className={`px-4 py-2 text-sm ${agent.riskScoreChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {agent.riskScoreChange > 0 ? `+${agent.riskScoreChange}` : agent.riskScoreChange}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};