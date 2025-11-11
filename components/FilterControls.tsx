import React, { useState } from 'react';

interface FilterControlsProps {
  managers: string[];
  teams: string[];
  onFilterChange: (filters: { manager: string; team: string }) => void;
  dateRange: { start: Date; end: Date };
  onDateChange: (range: { start: Date; end: Date }) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ managers, teams, onFilterChange, dateRange, onDateChange }) => {
  
  const toInputString = (date: Date) => date.toISOString().split('T')[0];

  const [localDates, setLocalDates] = useState({
    start: toInputString(dateRange.start),
    end: toInputString(dateRange.end)
  });

  const handleApplyDates = () => {
    onDateChange({
      start: new Date(localDates.start),
      end: new Date(localDates.end)
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <label htmlFor="managerFilter" className="text-gray-300 font-semibold text-sm">Manager:</label>
        <select 
          id="managerFilter"
          onChange={(e) => onFilterChange({ manager: e.target.value, team: (document.getElementById('teamFilter') as HTMLSelectElement).value })}
          className="bg-gray-700 border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
        >
          <option value="all">All Managers</option>
          {managers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="teamFilter" className="text-gray-300 font-semibold text-sm">Team:</label>
        <select 
          id="teamFilter"
          onChange={(e) => onFilterChange({ manager: (document.getElementById('managerFilter') as HTMLSelectElement).value, team: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
        >
          <option value="all">All Teams</option>
          {teams.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2 flex-grow">
         <label className="text-gray-300 font-semibold text-sm">From:</label>
         <input type="date" value={localDates.start} onChange={e => setLocalDates(d => ({...d, start: e.target.value}))} className="bg-gray-700 border-gray-600 text-white text-sm rounded-lg p-1.5" />
         <label className="text-gray-300 font-semibold text-sm">To:</label>
         <input type="date" value={localDates.end} onChange={e => setLocalDates(d => ({...d, end: e.target.value}))} className="bg-gray-700 border-gray-600 text-white text-sm rounded-lg p-1.5" />
         <button onClick={handleApplyDates} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg text-sm">Apply Dates</button>
      </div>
    </div>
  );
};