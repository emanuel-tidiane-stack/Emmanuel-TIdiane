import React from 'react';
import type { AgentRiskProfile } from '../types.ts';

interface AgentRiskTableProps {
  data: AgentRiskProfile[];
  onAgentSelect: (agent: AgentRiskProfile) => void;
  onToggleCompare: (agentId: string) => void;
  comparisonSelection: string[];
}

// FIX: Made children optional to allow for empty headers.
const TableHeader: React.FC<{ children?: React.ReactNode, className?: string }> = ({ children, className }) => (
    <th className={`px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${className || ''}`}>{children}</th>
);

const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <td className={`px-4 py-4 whitespace-nowrap text-sm ${className || 'text-gray-300'}`}>{children}</td>
);

const getRiskColor = (score: number) => {
    if (score > 75) return 'bg-red-500/20 text-red-400';
    if (score > 50) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
};

export const AgentRiskTable: React.FC<AgentRiskTableProps> = ({ data, onAgentSelect, onToggleCompare, comparisonSelection }) => {
    const sortedData = [...data].sort((a, b) => b.riskScore - a.riskScore);

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200">Agent Risk Profiles</h3>
                <span className="text-sm text-gray-400">Select up to 2 agents to compare</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <TableHeader className="w-8"></TableHeader>
                            <TableHeader>Agent</TableHeader>
                            <TableHeader>Manager</TableHeader>
                            <TableHeader>Team</TableHeader>
                            <TableHeader>Risk Score</TableHeader>
                            <TableHeader>Risk Change</TableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {sortedData.map((agent) => {
                        const isSelectedForCompare = comparisonSelection.includes(agent.agentId);
                        return (
                        <tr key={agent.agentId} className={`transition-colors ${isSelectedForCompare ? 'bg-blue-900/40' : 'hover:bg-gray-700/50'}`}>
                            <TableCell>
                                <input 
                                    type="checkbox"
                                    className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-600"
                                    checked={isSelectedForCompare}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        onToggleCompare(agent.agentId);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <a href="#" onClick={(e) => {e.preventDefault(); onAgentSelect(agent)}} className="font-medium text-white hover:text-blue-400">
                                    {agent.agentName}
                                </a>
                            </TableCell>
                            <TableCell>{agent.managerName}</TableCell>
                            <TableCell>{agent.team}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(agent.riskScore)}`}>
                                    {agent.riskScore}
                                </span>
                            </TableCell>
                            <TableCell className={agent.riskScoreChange > 0 ? 'text-red-400' : 'text-green-400'}>
                                {agent.riskScoreChange > 0 ? `+${agent.riskScoreChange}` : agent.riskScoreChange}
                            </TableCell>
                        </tr>
                    )})}
                    </tbody>
                </table>
            </div>
        </div>
    );
};