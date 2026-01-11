"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

interface TherapyPlan {
  id: string;
  planNumber: number;
  title: string;
  generalGoal: string;
  isActive: boolean;
  isAiGenerated: boolean;
  createdAt: string;
}

interface JobStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  currentStep: string;
  completedPlans: number;
  totalPlans: number;
  failedPlans: number;
  errorMessage?: string;
  planIds: string[];
  duration: number;
}

export default function TherapyPlansPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [plans, setPlans] = useState<TherapyPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPlans();
    
    // Cleanup polling on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  const fetchPlans = async () => {
    try {
      // Get child's diagnosis
      const childResponse = await fetch(`/api/children/${params.id}`);
      if (childResponse.ok) {
        const child = await childResponse.json();
        if (child.diagnoses && child.diagnoses.length > 0) {
          setDiagnosisId(child.diagnoses[0].id);
        }
      }

      // Get therapy plans
      const response = await fetch(`/api/plans?childId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("فشل في تحميل الخطط العلاجية");
    }
  };

  const pollJobStatus = async (jobId: string) => {
    try {
      const response = await fetch(`/api/plans/generate/status/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        const job: JobStatus = data.job;
        setJobStatus(job);

        // Update UI based on status
        if (job.status === "completed") {
          setIsGenerating(false);
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          
          toast.success(
            `تم توليد ${job.completedPlans} خطط علاجية بنجاح في ${job.duration} ثانية!`,
            {
              duration: 5000,
            }
          );
          
          // Refresh plans
          await fetchPlans();
          setJobStatus(null);
        } else if (job.status === "failed") {
          setIsGenerating(false);
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          
          toast.error(`فشل في توليد الخطط: ${job.errorMessage}`, {
            duration: 10000,
          });
          
          setJobStatus(null);
        }
      }
    } catch (error) {
      console.error("Error polling job status:", error);
    }
  };

  const generatePlans = async () => {
    if (!diagnosisId) {
      toast.error("لم يتم العثور على تشخيص للطفل");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosisId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في بدء توليد الخطط");
      }

      const data = await response.json();
      const jobId = data.jobId;

      toast.success("بدأت عملية توليد الخطط العلاجية", {
        description: "سيتم التحديث تلقائياً عند اكتمال العملية",
      });

      // Start polling job status every 2 seconds
      const interval = setInterval(() => {
        pollJobStatus(jobId);
      }, 2000);
      
      setPollingInterval(interval);

      // Initial poll
      pollJobStatus(jobId);
    } catch (error: any) {
      console.error("Error generating plans:", error);
      toast.error(error.message || "حدث خطأ أثناء بدء توليد الخطط");
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الخطط العلاجية</h1>
          <p className="text-gray-600 mt-2">
            الخطط المولدة بالذكاء الاصطناعي
          </p>
        </div>

        {plans.length === 0 && !isGenerating && (
          <Button onClick={generatePlans} disabled={isGenerating}>
            توليد 4 خطط علاجية
          </Button>
        )}
      </div>

      {/* ✅ Enhanced Progress Display */}
      {isGenerating && jobStatus && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {jobStatus.status === "pending" && (
                <Clock className="h-6 w-6 text-blue-500 animate-pulse" />
              )}
              {jobStatus.status === "processing" && (
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              )}
              {jobStatus.status === "completed" && (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              )}
              {jobStatus.status === "failed" && (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {jobStatus.status === "pending" && "في انتظار البدء..."}
                  {jobStatus.status === "processing" && "جاري توليد الخطط العلاجية"}
                  {jobStatus.status === "completed" && "اكتملت العملية بنجاح!"}
                  {jobStatus.status === "failed" && "فشلت العملية"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {jobStatus.currentStep}
                </p>
              </div>
              
              <Badge variant="outline" className="text-sm">
                {jobStatus.completedPlans} / {jobStatus.totalPlans}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">التقدم</span>
                <span className="font-semibold">{jobStatus.progress}%</span>
              </div>
              <Progress value={jobStatus.progress} className="h-3" />
            </div>

            {/* Time Display */}
            {jobStatus.duration > 0 && (
              <p className="text-xs text-gray-500 text-center">
                الوقت المستغرق: {jobStatus.duration} ثانية
              </p>
            )}

            {/* Failed Plans Warning */}
            {jobStatus.failedPlans > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ فشل توليد {jobStatus.failedPlans} خطة. سيتم توليد الخطط الناجحة فقط.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {plans.length === 0 && !isGenerating && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لم يتم توليد خطط علاجية بعد
              </h3>
              <p className="text-gray-600 mb-4">
                ابدأ بتوليد 4 خطط علاجية مخصصة باستخدام الذكاء الاصطناعي
              </p>
            </div>
            <Button onClick={generatePlans} size="lg">
              توليد الخطط الآن
            </Button>
          </div>
        </Card>
      )}

      {/* Plans Grid */}
      {plans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    خطة رقم {plan.planNumber}
                  </p>
                </div>
                {plan.isActive && (
                  <Badge className="bg-primary">الخطة النشطة</Badge>
                )}
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">{plan.generalGoal}</p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/children/${params.id}/plans/${plan.id}`)
                  }
                >
                  عرض التفاصيل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/children/${params.id}/plans/${plan.id}/edit`)
                  }
                >
                  تعديل
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

