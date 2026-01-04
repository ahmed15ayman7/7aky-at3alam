export interface Assessment {
  id: string;
  childId: string;
  assessmentDate: Date;
  
  // بيانات الأم والحمل
  motherAge?: number;
  siblingsCount?: number;
  birthType?: string;
  hadIncidentsDuringPregnancy: boolean;
  hasSimilarCaseInFamily: boolean;
  hadOxygenDeficiency: boolean;
  
  // تاريخ النمو
  walkingStartAge?: string;
  sittingStartAge?: string;
  hasHearingProblems: boolean;
  visitedENTDoctor: boolean;
  
  // الفحص العضوي
  jawDeformities: boolean;
  palateIssue: boolean;
  tongueTie: boolean;
  larynxInjuries: boolean;
  
  // أعراض مصاحبة
  bedwetting: boolean;
  anxiety: boolean;
  hyperactivity: boolean;
  fear: boolean;
  shyness: boolean;
  distracted: boolean;
  urinaryIncontinence: boolean;
  
  // التاريخ اللغوي
  firstWord?: string;
  knownWords?: string;
  spokenWords?: string;
  sentenceStart?: string;
  unclearSentences: boolean;
  
  // اللغة الاستقبالية
  receptiveLanguage?: ReceptiveLanguage;
  
  // نتائج الاختبارات
  iqScore?: number;
  mentalAge?: string;
  languageAge?: string;
  
  weaknessAreas?: WeaknessAreas;
  chiefComplaint: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ReceptiveLanguage {
  bodyParts: string[];
  animals: string[];
  vegetables: string[];
  furniture: string[];
  tools: string[];
  colors: string[];
}

export interface WeaknessAreas {
  linguistic: string[];
  academic: string[];
  mental: string[];
}

export interface AssessmentFormData {
  // Step 1: بيانات الأم والحمل
  motherAge?: number;
  siblingsCount?: number;
  birthType?: string;
  hadIncidentsDuringPregnancy?: boolean;
  hasSimilarCaseInFamily?: boolean;
  hadOxygenDeficiency?: boolean;
  
  // Step 2: تاريخ النمو
  walkingStartAge?: string;
  sittingStartAge?: string;
  hasHearingProblems?: boolean;
  visitedENTDoctor?: boolean;
  
  // Step 3: الفحص العضوي
  jawDeformities?: boolean;
  palateIssue?: boolean;
  tongueTie?: boolean;
  larynxInjuries?: boolean;
  
  // Step 4: الأعراض المصاحبة
  bedwetting?: boolean;
  anxiety?: boolean;
  hyperactivity?: boolean;
  fear?: boolean;
  shyness?: boolean;
  distracted?: boolean;
  urinaryIncontinence?: boolean;
  
  // Step 5: التاريخ اللغوي
  firstWord?: string;
  knownWords?: string;
  spokenWords?: string;
  sentenceStart?: string;
  unclearSentences?: boolean;
  
  // Step 6: اللغة الاستقبالية
  receptiveLanguage?: ReceptiveLanguage;
  
  // Step 7: نتائج الاختبارات
  iqScore?: number;
  mentalAge?: string;
  languageAge?: string;
  weaknessAreas?: WeaknessAreas;
  chiefComplaint: string;
}

