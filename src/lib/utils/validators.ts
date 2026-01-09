import { z } from "zod";

export const childFormSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  dateOfBirth: z.coerce.date({
    message: "تاريخ الميلاد مطلوب",
  }),
  gender: z.enum(["male", "female"], {
    message: "الجنس مطلوب",
  }),
  address: z.string().optional(),
  fatherJob: z.string().optional(),
  motherJob: z.string().optional(),
  phone: z.string().optional(),
  hasRelativeIssue: z.boolean().optional().default(false),
  centerId: z.string().min(1, "المركز مطلوب"),
  therapistId: z.string().min(1, "الأخصائي مطلوب"),
});

export const assessmentFormSchema = z.object({
  // Step 1: بيانات الأم والحمل
  motherAge: z.number().min(15).max(60).optional(),
  siblingsCount: z.number().min(0).max(20).optional(),
  birthType: z.string().optional(),
  hadIncidentsDuringPregnancy: z.boolean().optional().default(false),
  hasSimilarCaseInFamily: z.boolean().optional().default(false),
  hadOxygenDeficiency: z.boolean().optional().default(false),
  
  // Step 2: تاريخ النمو
  walkingStartAge: z.string().optional(),
  sittingStartAge: z.string().optional(),
  hasHearingProblems: z.boolean().optional().default(false),
  visitedENTDoctor: z.boolean().optional().default(false),
  
  // Step 3: الفحص العضوي
  jawDeformities: z.boolean().optional().default(false),
  palateIssue: z.boolean().optional().default(false),
  tongueTie: z.boolean().optional().default(false),
  larynxInjuries: z.boolean().optional().default(false),
  
  // Step 4: الأعراض المصاحبة
  bedwetting: z.boolean().optional().default(false),
  anxiety: z.boolean().optional().default(false),
  hyperactivity: z.boolean().optional().default(false),
  fear: z.boolean().optional().default(false),
  shyness: z.boolean().optional().default(false),
  distracted: z.boolean().optional().default(false),
  urinaryIncontinence: z.boolean().optional().default(false),
  
  // Step 5: التاريخ اللغوي
  firstWord: z.string().optional(),
  knownWords: z.string().optional(),
  spokenWords: z.string().optional(),
  sentenceStart: z.string().optional(),
  unclearSentences: z.boolean().optional().default(false),
  
  // Step 6: اللغة الاستقبالية
  receptiveLanguage: z.object({
    bodyParts: z.array(z.string()).default([]),
    animals: z.array(z.string()).default([]),
    vegetables: z.array(z.string()).default([]),
    furniture: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
  }).optional(),
  
  // Step 7: نتائج الاختبارات
  iqScore: z.number().min(0).max(200).optional(),
  mentalAge: z.string().optional(),
  languageAge: z.string().optional(),
  weaknessAreas: z.object({
    linguistic: z.array(z.string()).default([]),
    academic: z.array(z.string()).default([]),
    mental: z.array(z.string()).default([]),
  }).optional(),
  chiefComplaint: z.string().min(10, "الشكوى الرئيسية يجب أن تكون 10 أحرف على الأقل"),
});

export const diagnosisFormSchema = z.object({
  finalDiagnosis: z.string().min(5, "التشخيص يجب أن يكون 5 أحرف على الأقل"),
  severityLevel: z.enum(["خفيف", "متوسط", "شديد"], {
    message: "مستوى الشدة مطلوب",
  }),
  doctorNotes: z.string().optional(),
});

export type ChildFormValues = z.infer<typeof childFormSchema>;
export type AssessmentFormValues = z.infer<typeof assessmentFormSchema>;
export type DiagnosisFormValues = z.infer<typeof diagnosisFormSchema>;

