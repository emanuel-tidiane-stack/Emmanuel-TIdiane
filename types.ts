
export interface HistoricalDataPoint {
  week: number;
  completionRate: number;
  acknowledgmentRate: number;
  riskScore: number;
}

export interface AgentRiskProfile {
  agentId: string;
  agentName: string;
  managerName: string;
  team: string;
  riskScore: number;
  riskScoreChange: number; // New: For Top Improvers
  incompleteFeedbacks: number;
  agingFeedbacks: number;
  historicalData: HistoricalDataPoint[];
  completionRate: number;
  acknowledgmentRate: number;
}

export interface RootCause {
  name: string;
  count: number;
}

export interface IncompleteFeedback {
  BIcaptureID: string;
  agentName:string;
  managerName: string;
  agingDays: number;
}

export interface ManagerMetrics {
  managerId: string; // New
  managerName: string;
  coachingRate: number;
  completionRate: number;
  coachingDepthIndex: number;
  teamSize: number;
  teamAvgRiskScore: number; // New
}

export interface CoachingSummaryData {
  totalCoachingSessions: number;
  completedSessions: number;
  acknowledgedSessions: number;
  avgTimeToComplete: number; // in days
}

export interface PersistentUnderperformer {
  agentId: string;
  agentName: string;
  managerName: string;
  consecutiveWeeks: number;
  avgRiskScore: number;
}

export interface TopImprover { // New
  agentId: string;
  agentName: string;
  managerName: string;
  riskScoreChange: number;
  currentRiskScore: number;
}

// FIX: Added missing AgentWeeklyBreakdown interface.
export interface AgentWeeklyBreakdown {
  agentId: string;
  agentName: string;
  team: string;
  tasksAssigned: number;
  tasksCompleted: number;
  completionRate: number;
}

export interface RootCauseMatrix { // New
  managers: string[];
  causes: string[];
  matrix: { [manager: string]: { [cause: string]: number } };
}

export interface DashboardData {
  // Top-level metrics
  totalFeedbacks: number;
  completionRate: number;
  acknowledgmentRate: number;
  averageAging: number;

  // Chart and Table data
  rootCauses: RootCause[];
  agentRiskProfiles: AgentRiskProfile[];
  incompleteFeedbacks: IncompleteFeedback[];
  managerMetrics: ManagerMetrics[];
  coachingSummary: CoachingSummaryData;
  persistentUnderperformers: PersistentUnderperformer[];
  topImprovers: TopImprover[]; // New
  rootCauseMatrix: RootCauseMatrix; // New

  // Filter options
  managers: string[];
  teams: string[];
}