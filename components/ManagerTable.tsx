import React from 'react';
import type { ManagerMetrics } from '../types.ts';

interface ManagerTableProps {
  data: ManagerMetrics[];
  onManagerSelect: (manager: ManagerMetrics) => void;
}

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{children}</th>
);

const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <td className={`px-4 py-4 whitespace-nowrap text-sm ${className || 'text-gray-300'}`}>{children}</td>
);

export const ManagerTable: React.FC<ManagerTableProps> = ({ data, onManagerSelect }) => {
    const sortedData = [...data].sort((a, b) => b.coachingRate - a.coachingRate);
  
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Manager Coaching Effectiveness</h3>
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                    <tr>
                        <TableHeader>Manager</TableHeader>
                        <TableHeader>Team Size</TableHeader>
                        <TableHeader>Avg. Coaching Rate</TableHeader>
                        <TableHeader>Team Avg. Risk</TableHeader>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {sortedData.map((manager) => (
                        <tr key={manager.managerId} onClick={() => onManagerSelect(manager)} className="group hover:bg-gray-700/50 transition-colors cursor-pointer">
                            <TableCell className="font-medium text-white group-hover:text-blue-400 transition-colors">{manager.managerName}</TableCell>
                            <TableCell>{manager.teamSize}</TableCell>
                            <TableCell>{(manager.coachingRate * 100).toFixed(0)}%</TableCell>
                            <TableCell>{manager.teamAvgRiskScore.toFixed(1)}</TableCell>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};