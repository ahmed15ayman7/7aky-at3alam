"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  diagnosisFormSchema,
  type DiagnosisFormValues,
} from "@/lib/utils/validators";
import { toast } from "sonner";
interface Diagnosis {
  id: string;
  aiSuggestedDiagnosis: string;
  aiConfidence?: number;
  aiReasoning?: string;
  finalDiagnosis: string;
  severityLevel: string;
  isAiApproved: boolean;
  doctorNotes?: string;
}

export default function DiagnosisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  const form = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisFormSchema),
  });

  useEffect(() => {
    fetchChildData();
  }, []);

  const fetchChildData = async () => {
    try {
      // Get child's latest assessment
      const response = await fetch(`/api/assessment?childId=${id}`);
      if (response.ok) {
        const assessments = await response.json();
        if (assessments.length > 0) {
          setAssessmentId(assessments[0].id);
          
          // Check if diagnosis exists
          if (assessments[0].diagnosis) {
            setDiagnosis(assessments[0].diagnosis);
            form.reset({
              finalDiagnosis: assessments[0].diagnosis.finalDiagnosis,
              severityLevel: assessments[0].diagnosis.severityLevel as any,
              doctorNotes: assessments[0].diagnosis.doctorNotes || "",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching assessment:", error);
    }
  };

  const generateDiagnosis = async () => {
    if (!assessmentId) {
      toast.error("لم يتم العثور على تقييم للطفل");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/diagnosis/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في توليد التشخيص");
      }

      const newDiagnosis = await response.json();
      setDiagnosis(newDiagnosis);
      form.reset({
        finalDiagnosis: newDiagnosis.finalDiagnosis,
        severityLevel: newDiagnosis.severityLevel,
        doctorNotes: "",
      });
    } catch (error: any) {
      console.error("Error generating diagnosis:", error);
      alert(error.message || "حدث خطأ أثناء توليد التشخيص");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: DiagnosisFormValues) => {
    if (!diagnosis) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/diagnosis/${diagnosis.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في حفظ التشخيص");
      }

      // Navigate to therapy plans
      router.push(`/children/${id}/plans`);
    } catch (error: any) {
      console.error("Error saving diagnosis:", error);
      alert(error.message || "حدث خطأ أثناء حفظ التشخيص");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التشخيص</h1>
          <p className="text-gray-600 mt-2">
            توليد التشخيص بالذكاء الاصطناعي أو تعديله يدوياً
          </p>
        </div>
        
        {!diagnosis && (
          <Button onClick={generateDiagnosis} disabled={isGenerating}>
            {isGenerating ? "جاري التوليد..." : "توليد التشخيص بالـ AI"}
          </Button>
        )}
      </div>

      {!diagnosis && !isGenerating && (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">
            لم يتم توليد التشخيص بعد
          </p>
          <Button onClick={generateDiagnosis}>ابدأ التشخيص</Button>
        </Card>
      )}

      {isGenerating && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">
            جاري تحليل البيانات وتوليد التشخيص...
          </p>
        </Card>
      )}

      {diagnosis && (
        <div className="space-y-6">
          {/* AI Results */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                نتيجة الذكاء الاصطناعي
              </h2>
              <Badge variant="secondary">
                ثقة: {diagnosis.aiConfidence}%
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  التشخيص المقترح:
                </h3>
                <p className="text-gray-900">{diagnosis.aiSuggestedDiagnosis}</p>
              </div>

              {diagnosis.aiReasoning && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    التفسير:
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {diagnosis.aiReasoning}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Edit Form */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              تعديل التشخيص النهائي
            </h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="finalDiagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التشخيص النهائي</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل التشخيص النهائي"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="severityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مستوى الشدة</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر مستوى الشدة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="خفيف">خفيف</SelectItem>
                          <SelectItem value="متوسط">متوسط</SelectItem>
                          <SelectItem value="شديد">شديد</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctorNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ملاحظات الطبيب (اختياري)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أضف أي ملاحظات إضافية"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    رجوع
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "جاري الحفظ..." : "حفظ والمتابعة للخطط العلاجية"}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      )}
    </div>
  );
}

