export interface Session {
  id: string;
  childId: string;
  therapyPlanId?: string;
  therapistId: string;
  sessionNumber: number;
  sessionDate: Date;
  duration: number;
  activities?: SessionActivities;
  generalNotes?: string;
  overallProgress?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionActivities {
  freePlay: number;
  coreSkill: number;
  interactive: number;
  reinforcement: number;
}

export interface SessionTaskEvaluation {
  id: string;
  sessionId: string;
  taskId: string;
  score: number;
  notes?: string;
  createdAt: Date;
}

