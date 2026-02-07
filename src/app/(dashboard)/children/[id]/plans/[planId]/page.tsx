"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Printer, 
  Download, 
  Edit, 
  CheckCircle2, 
  Clock, 
  Target,
  ListChecks,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

interface TherapyPlan {
  id: string;
  title: string;
  generalGoal: string;
  duration: string;
  planNumber: number;
  isActive: boolean;
  planHtml: string;
  stages: Array<{
    id: string;
    stageNumber: number;
    title: string;
    period: string;
    duration?: string;
    goal?: string;
    description?: string;
    tasks: Array<{
      id: string;
      taskCode: string;
      taskName: string;
      goal: string;
      activities?: string;
      score: number;
      examples: string;
      performanceCriteria: string;
    }>;
  }>;
}

export default function PlanDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string; planId: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [plan, setPlan] = useState<TherapyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMoreTasks, setShowMoreTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const response = await fetch(`/api/plans/${params.planId}`);
      if (response.ok) {
        const data = await response.json();
        setPlan(data);
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
      toast.error("فشل في تحميل الخطة");
    } finally {
      setIsLoading(false);
    }
  };

  const activatePlan = async () => {
    try {
      await fetch(`/api/plans/${params.planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });

      toast.success("تم تفعيل الخطة بنجاح!");
      fetchPlan();
    } catch (error) {
      console.error("Error activating plan:", error);
      toast.error("فشل في تفعيل الخطة");
    }
  };

  const printPlan = () => {
    if (!plan) return;

    // فتح نافذة جديدة للطباعة
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("فشل في فتح نافذة الطباعة");
      return;
    }

    printWindow.document.write(plan.planHtml);
    printWindow.document.close();

    // انتظر التحميل ثم اطبع
    printWindow.onload = () => {
      printWindow.print();
    };

    toast.success("جاري فتح نافذة الطباعة...");
  };

  const downloadPDF = async () => {
    try {
      toast.info("جاري تحضير ملف PDF...");
      const response = await fetch(`/api/plans/${params.planId}/export?format=pdf`);
      
      if (!response.ok) {
        throw new Error("فشل في تصدير PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${plan?.title || "خطة-علاجية"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("تم تحميل ملف PDF بنجاح!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("فشل في تحميل PDF");
    }
  };

  const parseActivities = (activities?: string): string[] => {
    if (!activities) return [];
    try {
      const parsed = typeof activities === "string" ? JSON.parse(activities) : activities;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">الخطة غير موجودة</p>
      </div>
    );
  }

  // حساب إجمالي الأنشطة
  const totalTasks = plan.stages.reduce((sum, stage) => sum + stage.tasks.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{plan.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>المدة: {plan.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <ListChecks className="w-4 h-4" />
              <span>خطة رقم {plan.planNumber}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{plan.stages.length} مراحل</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{totalTasks} نشاط</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {!plan.isActive && (
            <Button onClick={activatePlan} className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              تفعيل هذه الخطة
            </Button>
          )}
          {plan.isActive && (
            <Badge className="bg-green-600 px-4 py-2">
              <CheckCircle2 className="w-4 h-4 ml-1" />
              الخطة النشطة
            </Badge>
          )}

          <Button variant="outline" onClick={printPlan} className="gap-2">
            <Printer className="w-4 h-4" />
            طباعة
          </Button>

          <Button variant="outline" onClick={downloadPDF} className="gap-2">
            <Download className="w-4 h-4" />
            تحميل PDF
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              router.push(`/children/${params.id}/plans/${params.planId}/edit`)
            }
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل
          </Button>
        </div>
      </div>

      {/* General Goal */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-white border-2 border-primary">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              الهدف العلاجي العام
            </h2>
            <p className="text-gray-700 leading-relaxed">{plan.generalGoal}</p>
          </div>
        </div>
      </Card>

      {/* Goals Timeline */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-gray-900">
            فهرسة الأهداف حسب المدة الزمنية
          </h2>
        </div>
        <div className="space-y-3">
          {plan.stages.map((stage, idx) => (
            <div
              key={stage.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-r-4 border-primary"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{stage.title}</h3>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    {stage.duration || "غير محدد"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <Clock className="w-3 h-3 inline ml-1" />
                  {stage.period}
                </p>
                {stage.goal && (
                  <p className="text-gray-700 mt-2">
                    <strong className="text-secondary">الهدف:</strong> {stage.goal}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="html">معاينة للطباعة</TabsTrigger>
          {plan.stages.map((stage) => (
            <TabsTrigger key={stage.id} value={`stage-${stage.id}`}>
              المرحلة {stage.stageNumber}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          {plan.stages.map((stage, idx) => (
            <Card key={stage.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    المرحلة {idx + 1}: {stage.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {stage.period}
                    </span>
                    {stage.duration && (
                      <Badge variant="secondary">{stage.duration}</Badge>
                    )}
                  </div>
                  {stage.goal && (
                    <p className="text-gray-700 mt-3 p-3 bg-blue-50 rounded-lg border-r-4 border-secondary">
                      <strong className="text-secondary">الهدف:</strong> {stage.goal}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {stage.tasks.length} نشاط
                </Badge>
              </div>

              <div className="space-y-2">
                {stage.tasks
                  .slice(0, showMoreTasks[stage.id] ? stage.tasks.length : 5)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-secondary">{task.taskCode}</Badge>
                          <span className="font-semibold text-gray-900">
                            {task.taskName}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mr-16">{task.goal}</p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {task.score}
                      </Badge>
                    </div>
                  ))}
                {stage.tasks.length > 5 && !showMoreTasks[stage.id] && (
                  <button
                    className="w-full text-center py-3 text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() =>
                      setShowMoreTasks({ ...showMoreTasks, [stage.id]: true })
                    }
                  >
                    عرض {stage.tasks.length - 5} نشاط إضافي ←
                  </button>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* HTML Preview Tab */}
        <TabsContent value="html" className="mt-6">
          <Card className="p-6">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: plan.planHtml }}
            />
          </Card>
        </TabsContent>

        {/* Stage Detail Tabs */}
        {plan.stages.map((stage) => (
          <TabsContent key={stage.id} value={`stage-${stage.id}`} className="mt-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {stage.title}
                </h2>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                    <Clock className="w-4 h-4" />
                    {stage.period}
                  </span>
                  {stage.duration && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                      {stage.duration}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {stage.tasks.length} نشاط
                  </span>
                </div>
                {stage.goal && (
                  <div className="p-4 bg-blue-50 rounded-lg border-r-4 border-secondary">
                    <strong className="text-secondary">🎯 الهدف الرئيسي:</strong>
                    <p className="text-gray-700 mt-1">{stage.goal}</p>
                  </div>
                )}
                {stage.description && (
                  <p className="text-gray-600 mt-3">{stage.description}</p>
                )}
              </div>

              <div className="space-y-4">
                {stage.tasks.map((task) => {
                  const activities = parseActivities(task.activities);
                  return (
                    <Card key={task.id} className="p-5 bg-gradient-to-br from-gray-50 to-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-secondary text-base px-3 py-1">
                            {task.taskCode}
                          </Badge>
                          <span className="font-bold text-lg text-gray-900">
                            {task.taskName}
                          </span>
                        </div>
                        <Badge className="text-lg px-3 py-1">
                          الدرجة: {task.score}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <strong className="text-gray-700">🎯 الهدف:</strong>
                          <p className="text-gray-600 mt-1">{task.goal}</p>
                        </div>

                        {activities.length > 0 && (
                          <div>
                            <strong className="text-gray-700">📝 الأنشطة المقترحة:</strong>
                            <ul className="mt-2 space-y-1 mr-5">
                              {activities.map((activity, idx) => (
                                <li key={idx} className="text-gray-600 list-disc">
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <strong className="text-gray-700">💡 أمثلة:</strong>
                          <p className="text-gray-600 mt-1">{task.examples}</p>
                        </div>

                        <div>
                          <strong className="text-gray-700">📊 محكات الأداء:</strong>
                          <pre className="text-gray-600 mt-1 whitespace-pre-line font-sans text-sm bg-white p-3 rounded border">
                            {task.performanceCriteria}
                          </pre>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
