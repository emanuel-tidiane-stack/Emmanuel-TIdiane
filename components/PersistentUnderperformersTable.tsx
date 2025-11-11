import React from 'react';
import type { PersistentUnderperformer } from '../types.ts';

interface PersistentUnderperformersTableProps {
  data: PersistentUnderperformer[];
}

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{children}</th>
);

const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <td className={`px-4 py-4 whitespace-nowrap text-sm ${className || 'text-gray-300'}`}>{children}</td>
);

export const PersistentUnderperformersTable: React.FC<PersistentUnderperformersTableProps> = ({ data }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Persistent Underperformers (Bottom 3)</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <TableHeader>Agent</TableHeader>
                            <TableHeader>Manager</TableHeader>
                            <TableHeader>Consecutive Weeks</TableHeader>
                            <TableHeader>Avg. Risk Score</TableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {data.map((item) => (
                        <tr key={item.agentId} className="hover:bg-gray-700/50 transition-colors">
                            <TableCell className="font-medium text-white">{item.agentName}</TableCell>
                            <TableCell>{item.managerName}</TableCell>
                            <TableCell className="text-center">{item.consecutiveWeeks}</TableCell>
                            <TableCell>
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/20 text-red-400">
                                    {item.avgRiskScore.toFixed(0)}
                                </span>
                            </TableCell>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};