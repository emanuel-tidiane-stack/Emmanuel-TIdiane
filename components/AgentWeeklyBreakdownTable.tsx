import React from 'react';
import type { AgentWeeklyBreakdown } from '../types.ts';

interface AgentWeeklyBreakdownTableProps {
  data: AgentWeeklyBreakdown[];
}

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{children}</th>
);

const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <td className={`px-4 py-4 whitespace-nowrap text-sm ${className || 'text-gray-300'}`}>{children}</td>
);

export const AgentWeeklyBreakdownTable: React.FC<AgentWeeklyBreakdownTableProps> = ({ data }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Agent Weekly Task Breakdown</h3>
            <div className="overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50 sticky top-0">
                        <tr>
                            <TableHeader>Agent</TableHeader>
                            <TableHeader>Team</TableHeader>
                            <TableHeader>Tasks Assigned</TableHeader>
                            <TableHeader>Tasks Completed</TableHeader>
                            <TableHeader>Completion Rate</TableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {data.map((item) => (
                        <tr key={item.agentId} className="hover:bg-gray-700/50 transition-colors">
                            <TableCell className="font-medium text-white">{item.agentName}</TableCell>
                            <TableCell>{item.team}</TableCell>
                            <TableCell className="text-center">{item.tasksAssigned}</TableCell>
                            <TableCell className="text-center">{item.tasksCompleted}</TableCell>
                            <TableCell>{(item.completionRate * 100).toFixed(0)}%</TableCell>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};