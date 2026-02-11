"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  assessmentFormSchema,
  type AssessmentFormValues,
} from "@/lib/utils/validators";
import { MotherInfoStep } from "./MotherInfoStep";
import { DevelopmentHistoryStep } from "./DevelopmentHistoryStep";
import { PhysicalExamStep } from "./PhysicalExamStep";
import { SymptomsStep } from "./SymptomsStep";
import { LanguageHistoryStep } from "./LanguageHistoryStep";
import { ReceptiveLanguageStep } from "./ReceptiveLanguageStep";
import { TestResultsStep } from "./TestResultsStep";

const steps = [
  { id: 1, title: "بيانات الأم والحمل" },
  { id: 2, title: "تاريخ النمو" },
  { id: 3, title: "الفحص العضوي" },
  { id: 4, title: "الأعراض المصاحبة" },
  { id: 5, title: "التاريخ اللغوي" },
  { id: 6, title: "اللغة الاستقبالية" },
  { id: 7, title: "نتائج الاختبارات" },
];

interface AssessmentFormProps {
  childId: string;
}

export function AssessmentForm({ childId }: AssessmentFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      hadIncidentsDuringPregnancy: false,
      hasSimilarCaseInFamily: false,
      hadOxygenDeficiency: false,
      hasHearingProblems: false,
      visitedENTDoctor: false,
      jawDeformities: false,
      palateIssue: false,
      tongueTie: false,
      larynxInjuries: false,
      bedwetting: false,
      anxiety: false,
      hyperactivity: false,
      fear: false,
      shyness: false,
      distracted: false,
      urinaryIncontinence: false,
      unclearSentences: false,
      receptiveLanguage: {
        bodyParts: [],
        animals: [],
        vegetables: [],
        furniture: [],
        tools: [],
        colors: [],
      },
      weaknessAreas: {
        linguistic: [],
        academic: [],
        mental: [],
      },
      otherSymptoms: [],
      chiefComplaint: "",
    },
  });

  const onSubmit = async (data: AssessmentFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في حفظ التقييم");
      }

      const assessment = await response.json();
      toast.success("تم حفظ التقييم بنجاح!", {
        description: "سيتم توجيهك لصفحة التشخيص",
      });
      router.push(`/children/${childId}/diagnosis`);
    } catch (error: any) {
      console.error("Error saving assessment:", error);
      toast.error("خطأ في حفظ التقييم", {
        description: error.message || "حدث خطأ أثناء حفظ التقييم",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">استمارة التقييم</h2>
          <p className="text-gray-600 mt-2">
            {steps[currentStep - 1].title} - الخطوة {currentStep} من {steps.length}
          </p>
        </div>

        <Progress value={progress} className="w-full" />

        <Card className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 1 && <MotherInfoStep />}
            {currentStep === 2 && <DevelopmentHistoryStep />}
            {currentStep === 3 && <PhysicalExamStep />}
            {currentStep === 4 && <SymptomsStep />}
            {currentStep === 5 && <LanguageHistoryStep />}
            {currentStep === 6 && <ReceptiveLanguageStep />}
            {currentStep === 7 && <TestResultsStep />}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                السابق
              </Button>

              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  التالي
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "جاري الحفظ..." : "حفظ التقييم"}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </FormProvider>
  );
}

