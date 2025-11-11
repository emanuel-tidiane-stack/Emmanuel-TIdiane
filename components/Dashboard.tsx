import React, { useState, useMemo } from 'react';
import type { DashboardData, AgentRiskProfile, ManagerMetrics } from '../types.ts';
import { MetricCard } from './MetricCard.tsx';
import { RateGauge } from './RateGauge.tsx';
import { RootCauseChart } from './RootCauseChart.tsx';
import { AgentRiskTable } from './AgentRiskTable.tsx';
import { IncompleteFeedbackTable } from './IncompleteFeedbackTable.tsx';
import { ManagerTable } from './ManagerTable.tsx';
import { FilterControls } from './FilterControls.tsx';
import { CoachingSummary } from './CoachingSummary.tsx';
import { PersistentUnderperformersTable } from './PersistentUnderperformersTable.tsx';
import { AgentDrilldownModal } from './AgentDrilldownModal.tsx';
import { ManagerDrilldownModal } from './ManagerDrilldownModal.tsx';
import { ComparisonModal } from './ComparisonModal.tsx';
import { AISummary } from './AISummary.tsx';
import { RootCauseHeatmap } from './RootCauseHeatmap.tsx';
import { TopImproversTable } from './TopImproversTable.tsx';

interface DashboardProps {
  data: DashboardData;
  dateRange: { start: Date; end: Date };
  onDateChange: (range: { start: Date; end: Date }) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, dateRange, onDateChange }) => {
  const [filters, setFilters] = useState<{ manager: string; team: string }>({ manager: 'all', team: 'all' });
  const [selectedAgent, setSelectedAgent] = useState<AgentRiskProfile | null>(null);
  const [selectedManager, setSelectedManager] = useState<ManagerMetrics | null>(null);
  const [comparisonList, setComparisonList] = useState<string[]>([]);

  const filteredAgentData = useMemo(() => {
    return data.agentRiskProfiles.filter(agent => {
      const managerMatch = filters.manager === 'all' || agent.managerName === filters.manager;
      const teamMatch = filters.team === 'all' || agent.team === filters.team;
      return managerMatch && teamMatch;
    });
  }, [data.agentRiskProfiles, filters]);

  const handleToggleCompare = (agentId: string) => {
    setComparisonList(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      }
      if (prev.length < 2) {
        return [...prev, agentId];
      }
      return prev; // Max 2
    });
  };

  const comparisonAgents = useMemo(() => 
    comparisonList.map(id => data.agentRiskProfiles.find(a => a.agentId === id)).filter(Boolean) as AgentRiskProfile[],
    [comparisonList, data.agentRiskProfiles]
  );

  return (
    <div className="space-y-6">
      <AISummary data={data} />

      <FilterControls
        managers={data.managers}
        teams={data.teams}
        onFilterChange={setFilters}
        dateRange={dateRange}
        onDateChange={onDateChange}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Feedbacks" value={data.totalFeedbacks} />
        <MetricCard title="Avg. Aging (Incomplete)" value={`${data.averageAging.toFixed(1)} days`} />
        <RateGauge title="Completion Rate" rate={data.completionRate} />
        <RateGauge title="Acknowledgment Rate" rate={data.acknowledgmentRate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoachingSummary data={data.coachingSummary} />
        <RootCauseChart data={data.rootCauses.slice(0, 5)} />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AgentRiskTable 
                data={filteredAgentData} 
                onAgentSelect={setSelectedAgent}
                onToggleCompare={handleToggleCompare}
                comparisonSelection={comparisonList}
            />
          </div>
          <div className="space-y-6">
            <TopImproversTable data={data.topImprovers} />
            <PersistentUnderperformersTable data={data.persistentUnderperformers} />
          </div>
      </div>
      
      <RootCauseHeatmap data={data.rootCauseMatrix} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ManagerTable data={data.managerMetrics} onManagerSelect={setSelectedManager} />
        <IncompleteFeedbackTable data={data.incompleteFeedbacks} />
      </div>
      
      {/* Modals */}
      {selectedAgent && (
        <AgentDrilldownModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
      {selectedManager && (
        <ManagerDrilldownModal 
            manager={selectedManager} 
            agents={data.agentRiskProfiles.filter(a => a.managerName === selectedManager.managerName)}
            onClose={() => setSelectedManager(null)} 
        />
      )}
      {/* FIX: Cast comparisonAgents to the tuple type expected by ComparisonModal. */}
      {comparisonAgents.length === 2 && (
        <ComparisonModal agents={comparisonAgents as [AgentRiskProfile, AgentRiskProfile]} onClose={() => setComparisonList([])} />
      )}
    </div>
  );
};