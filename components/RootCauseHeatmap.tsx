import React from 'react';
import type { RootCauseMatrix } from '../types.ts';

interface RootCauseHeatmapProps {
  data: RootCauseMatrix;
}

const getColorForValue = (value: number, max: number): string => {
    if (value === 0) return 'bg-gray-800';
    const intensity = Math.min(1, value / max);
    if (intensity < 0.2) return 'bg-blue-900/40';
    if (intensity < 0.4) return 'bg-blue-900/60';
    if (intensity < 0.6) return 'bg-blue-800/80';
    if (intensity < 0.8) return 'bg-blue-700';
    return 'bg-blue-600';
};

export const RootCauseHeatmap: React.FC<RootCauseHeatmapProps> = ({ data }) => {
    const maxCount = Math.max(...Object.values(data.matrix).flatMap(causeObj => Object.values(causeObj)));

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Root Cause Heatmap by Manager</h3>
            <div className="overflow-x-auto">
                <div className="grid gap-1" style={{gridTemplateColumns: `150px repeat(${data.causes.length}, minmax(120px, 1fr))`}}>
                    {/* Header Row */}
                    <div />
                    {data.causes.map(cause => (
                        <div key={cause} className="text-xs text-gray-400 font-bold p-2 text-center truncate" title={cause}>
                            {cause}
                        </div>
                    ))}
                    
                    {/* Data Rows */}
                    {data.managers.map(manager => (
                        <React.Fragment key={manager}>
                            <div className="text-sm font-semibold text-gray-300 p-2 flex items-center">{manager}</div>
                            {data.causes.map(cause => {
                                const count = data.matrix[manager]?.[cause] ?? 0;
                                return (
                                    <div 
                                        key={`${manager}-${cause}`} 
                                        className={`rounded-md flex items-center justify-center font-bold text-white ${getColorForValue(count, maxCount)}`}
                                        title={`${manager} - ${cause}: ${count} incidents`}
                                    >
                                        {count > 0 ? count : ''}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};