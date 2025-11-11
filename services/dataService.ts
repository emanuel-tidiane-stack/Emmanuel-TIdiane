import type { DashboardData, RootCauseMatrix, TopImprover } from '../types.ts';

const AGENTS = [
  { id: 'A001', name: 'John Doe', manager: 'Alice Smith', team: 'Alpha' },
  { id: 'A002', name: 'Jane Roe', manager: 'Alice Smith', team: 'Alpha' },
  { id: 'A003', name: 'Peter Jones', manager: 'Bob Johnson', team: 'Bravo' },
  { id: 'A004', name: 'Mary Major', manager: 'Bob Johnson', team: 'Bravo' },
  { id: 'A005', name: 'Chris Green', manager: 'Carol White', team: 'Charlie' },
  { id: 'A006', name: 'Patricia Black', manager: 'Carol White', team: 'Charlie' },
  { id: 'A007', name: 'Michael Brown', manager: 'Alice Smith', team: 'Alpha' },
  { id: 'A008', name: 'Linda Davis', manager: 'Bob Johnson', team: 'Bravo' },
];

const MANAGERS = [
    {id: 'M01', name: 'Alice Smith'},
    {id: 'M02', name: 'Bob Johnson'},
    {id: 'M03', name: 'Carol White'}
];
const TEAMS = ['Alpha', 'Bravo', 'Charlie'];

const ROOT_CAUSES = ['Product Knowledge Gap', 'System Issue', 'Process Flaw', 'Communication Error', 'Customer Misunderstanding'];

const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate 90 days of historical data
const generateMockFeedbacks = (days: number): RawFeedbackData[] => {
  const feedbacks: RawFeedbackData[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Create ~15-25 feedbacks per day
    const dailyFeedbackCount = 15 + Math.floor(Math.random() * 10);
    for (let j = 0; j < dailyFeedbackCount; j++) {
      const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const statusRoll = Math.random();
      let status: RawFeedbackData['status'] = 'Incomplete';
      if (statusRoll < 0.7) status = 'Complete';
      else if (statusRoll < 0.9) status = 'Acknowledged';

      // Agents who are "improvers" get better scores over time
      const isImprover = ['John Doe', 'Mary Major'].includes(agent.name);
      const riskTrend = isImprover ? (i / days) * 50 : 0; // Risk decreases as we get closer to today (i gets smaller)

      feedbacks.push({
        BIcaptureID: `FB-${date.getTime()}-${j}`,
        agentId: agent.id,
        agentName: agent.name,
        managerName: agent.manager,
        team: agent.team,
        status,
        createdAt: date.toISOString(),
        riskScore: Math.floor(Math.random() * 40 + 30 - riskTrend),
        rootCause: status !== 'Incomplete' ? ROOT_CAUSES[Math.floor(Math.random() * ROOT_CAUSES.length)] : undefined,
      });
    }
  }
  return feedbacks;
};

interface RawFeedbackData {
    BIcaptureID: string;
    agentId: string;
    agentName: string;
    managerName: string;
    team: string;
    status: 'Complete' | 'Incomplete' | 'Acknowledged';
    createdAt: string;
    rootCause?: string;
    riskScore: number;
}

export const fetchData = (): RawFeedbackData[] => {
    return generateMockFeedbacks(90);
};

export const processData = (rawData: RawFeedbackData[], startDate: Date, endDate: Date): DashboardData => {
    const rangeData = rawData.filter(f => {
        const d = new Date(f.createdAt);
        return d >= startDate && d <= endDate;
    });

    // Calculate previous period for trend analysis
    const diff = endDate.getTime() - startDate.getTime();
    const prevStartDate = new Date(startDate.getTime() - diff);
    const prevEndDate = new Date(endDate.getTime() - diff);
    const prevRangeData = rawData.filter(f => {
        const d = new Date(f.createdAt);
        return d >= prevStartDate && d < startDate;
    });

    const totalFeedbacks = rangeData.length;
    const completedFeedbacks = rangeData.filter(f => f.status === 'Complete' || f.status === 'Acknowledged');
    const acknowledgedFeedbacks = rangeData.filter(f => f.status === 'Complete');
    
    const completionRate = totalFeedbacks > 0 ? completedFeedbacks.length / totalFeedbacks : 0;
    const acknowledgmentRate = totalFeedbacks > 0 ? acknowledgedFeedbacks.length / totalFeedbacks : 0;
    
    const incompleteFeedbacks = rangeData
        .filter(f => f.status === 'Incomplete')
        .map(f => ({
            BIcaptureID: f.BIcaptureID, agentName: f.agentName, managerName: f.managerName,
            agingDays: Math.floor((new Date().getTime() - new Date(f.createdAt).getTime()) / (1000 * 3600 * 24)),
        }));

    const averageAging = incompleteFeedbacks.length > 0
        ? incompleteFeedbacks.reduce((acc, f) => acc + f.agingDays, 0) / incompleteFeedbacks.length
        : 0;
    
    const rootCauseCounts = rangeData.reduce((acc, f) => {
        if (f.rootCause) acc[f.rootCause] = (acc[f.rootCause] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const rootCauses = Object.entries(rootCauseCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

    const getAgentStats = (feedbacks: RawFeedbackData[]) => {
        const stats = new Map<string, { totalRisk: number, count: number }>();
        feedbacks.forEach(f => {
            const current = stats.get(f.agentId) || { totalRisk: 0, count: 0 };
            current.totalRisk += f.riskScore;
            current.count++;
            stats.set(f.agentId, current);
        });
        const avgs = new Map<string, number>();
        stats.forEach((val, key) => {
            avgs.set(key, val.count > 0 ? val.totalRisk / val.count : 0);
        });
        return avgs;
    };
    
    const currentPeriodAvgs = getAgentStats(rangeData);
    const prevPeriodAvgs = getAgentStats(prevRangeData);

    const agentRiskProfiles = AGENTS.map(agent => {
        const agentFeedbacks = rangeData.filter(f => f.agentId === agent.id);
        const agentIncomplete = agentFeedbacks.filter(f => f.status === 'Incomplete');
        const currentRisk = currentPeriodAvgs.get(agent.id) || 0;
        const prevRisk = prevPeriodAvgs.get(agent.id) || currentRisk; // If no prev data, assume no change

        return {
            agentId: agent.id, agentName: agent.name, managerName: agent.manager, team: agent.team,
            riskScore: Math.round(currentRisk),
            riskScoreChange: Math.round(currentRisk - prevRisk),
            incompleteFeedbacks: agentIncomplete.length,
            agingFeedbacks: agentIncomplete.filter(f => (new Date().getTime() - new Date(f.createdAt).getTime()) / (1000 * 3600 * 24) > 7).length,
            completionRate: agentFeedbacks.length > 0 ? agentFeedbacks.filter(f => f.status !== 'Incomplete').length / agentFeedbacks.length : 0,
            acknowledgmentRate: agentFeedbacks.length > 0 ? agentFeedbacks.filter(f => f.status === 'Complete').length / agentFeedbacks.length : 0,
            historicalData: Array.from({ length: 8 }, (_, i) => ({
                week: i + 1, completionRate: Math.round(80 + Math.random() * 20),
                acknowledgmentRate: Math.round(70 + Math.random() * 25), riskScore: Math.round(20 + Math.random() * 50),
            })),
        };
    });

    const managerMetrics = MANAGERS.map(manager => {
        const teamAgentIds = AGENTS.filter(a => a.manager === manager.name).map(a => a.id);
        const teamProfiles = agentRiskProfiles.filter(p => teamAgentIds.includes(p.agentId));
        const managerFeedbacks = rangeData.filter(f => teamAgentIds.includes(f.agentId));

        return {
            managerId: manager.id, managerName: manager.name, teamSize: teamAgentIds.length,
            completionRate: managerFeedbacks.length > 0 ? managerFeedbacks.filter(f => f.status !== 'Incomplete').length / managerFeedbacks.length : 0,
            coachingRate: Math.random() * 0.2 + 0.75,
            coachingDepthIndex: Math.random() * 4 + 1,
            teamAvgRiskScore: teamProfiles.length > 0 ? teamProfiles.reduce((sum, p) => sum + p.riskScore, 0) / teamProfiles.length : 0,
        };
    });

    const topImprovers: TopImprover[] = [...agentRiskProfiles]
        .filter(a => a.riskScoreChange < 0)
        .sort((a, b) => a.riskScoreChange - b.riskScoreChange)
        .slice(0, 5)
        .map(a => ({
            agentId: a.agentId, agentName: a.agentName, managerName: a.managerName,
            riskScoreChange: a.riskScoreChange, currentRiskScore: a.riskScore,
        }));
        
    const rootCauseMatrix: RootCauseMatrix = {
        managers: MANAGERS.map(m => m.name),
        causes: ROOT_CAUSES,
        matrix: MANAGERS.reduce((acc, m) => {
            acc[m.name] = ROOT_CAUSES.reduce((causeAcc, cause) => {
                causeAcc[cause] = 0;
                return causeAcc;
            }, {} as {[key: string]: number});
            return acc;
        }, {} as RootCauseMatrix['matrix'])
    };
    rangeData.forEach(f => {
        if (f.rootCause && rootCauseMatrix.matrix[f.managerName]) {
            rootCauseMatrix.matrix[f.managerName][f.rootCause]++;
        }
    });

    return {
        totalFeedbacks, completionRate, acknowledgmentRate,
        averageAging: Math.round(averageAging), rootCauses, agentRiskProfiles,
        incompleteFeedbacks, managerMetrics,
        coachingSummary: { totalCoachingSessions: totalFeedbacks, completedSessions: completedFeedbacks.length, acknowledgedSessions: acknowledgedFeedbacks.length, avgTimeToComplete: 5.2 },
        persistentUnderperformers: agentRiskProfiles.filter(a => a.riskScore > 75).slice(0,3).map(a => ({ agentId: a.agentId, agentName: a.agentName, managerName: a.managerName, consecutiveWeeks: 3, avgRiskScore: a.riskScore })),
        topImprovers, rootCauseMatrix,
        managers: MANAGERS.map(m => m.name), teams: TEAMS,
    };
};