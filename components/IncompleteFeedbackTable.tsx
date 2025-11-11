import React from 'react';
// FIX: Corrected import path
import type { IncompleteFeedback } from '../types.ts';

interface IncompleteFeedbackTableProps {
  data: IncompleteFeedback[];
}

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{children}</th>
);

const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <td className={`px-4 py-4 whitespace-nowrap text-sm ${className || 'text-gray-300'}`}>{children}</td>
);


export const IncompleteFeedbackTable: React.FC<IncompleteFeedbackTableProps> = ({ data }) => {
    const sortedData = [...data].sort((a, b) => b.agingDays - a.agingDays);

    const getAgingColor = (days: number) => {
        if (days > 14) return 'text-red-400';
        if (days > 7) return 'text-yellow-400';
        return 'text-gray-300';
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Incomplete Feedback Aging</h3>
            {data.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                    No incomplete feedback. Great job!
                </div>
            ) : (
                <div className="overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700/50 sticky top-0">
                            <tr>
                                <TableHeader>Aging (Days)</TableHeader>
                                <TableHeader>Agent</TableHeader>
                                <TableHeader>Manager</TableHeader>
                                <TableHeader>Feedback ID</TableHeader>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {sortedData.map((item) => (
                            <tr key={item.BIcaptureID} className="hover:bg-gray-700/50 transition-colors">
                                <TableCell className={`font-bold ${getAgingColor(item.agingDays)}`}>
                                    {item.agingDays} days
                                </TableCell>
                                <TableCell>{item.agentName}</TableCell>
                                <TableCell>{item.managerName}</TableCell>
                                <TableCell className="font-mono text-xs">{item.BIcaptureID}</TableCell>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
             )}
        </div>
    );
};