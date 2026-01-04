export interface TherapyPlan {
  id: string;
  childId: string;
  diagnosisId: string;
  planNumber: number;
  title: string;
  generalGoal: string;
  duration: string;
  planData: PlanData;
  planHtml: string;
  isActive: boolean;
  isAiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanData {
  title: string;
  generalGoal: string;
  duration: string;
  stages: StageData[];
  sessionModel: SessionModel;
  evaluationCriteria: string[];
}

export interface StageData {
  stageNumber: number;
  title: string;
  period: string;
  description?: string;
  tasks: TaskData[];
}

export interface TaskData {
  taskCode: string;
  taskName: string;
  goal: string;
  question: string;
  examples: string;
  performanceCriteria: string;
  score: number;
  notes?: string;
}

export interface SessionModel {
  freePlay: number;
  coreSkill: number;
  interactive: number;
  reinforcement: number;
}

