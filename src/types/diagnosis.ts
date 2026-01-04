export interface Diagnosis {
  id: string;
  childId: string;
  assessmentId: string;
  aiSuggestedDiagnosis: string;
  aiConfidence?: number;
  aiReasoning?: string;
  finalDiagnosis: string;
  severityLevel: "خفيف" | "متوسط" | "شديد";
  isAiApproved: boolean;
  doctorNotes?: string;
  diagnosisDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiagnosisFormData {
  finalDiagnosis: string;
  severityLevel: "خفيف" | "متوسط" | "شديد";
  doctorNotes?: string;
}

