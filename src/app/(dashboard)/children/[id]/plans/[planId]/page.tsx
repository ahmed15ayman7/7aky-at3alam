"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    title: string;
    period: string;
    tasks: Array<{
      id: string;
      taskCode: string;
      taskName: string;
      goal: string;
      score: number;
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
      
      // Deactivate other plans
      // TODO: Add API endpoint to handle this

      alert("تم تفعيل الخطة بنجاح!");
      fetchPlan();
    } catch (error) {
      console.error("Error activating plan:", error);
      alert("فشل في تفعيل الخطة");
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
          <p className="text-gray-600 mt-2">
            المدة: {plan.duration} | خطة رقم {plan.planNumber}
          </p>
        </div>

        <div className="flex gap-2">
          {!plan.isActive && (
            <Button onClick={activatePlan}>تفعيل هذه الخطة</Button>
          )}
          {plan.isActive && <Badge className="bg-primary">الخطة النشطة</Badge>}
          
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/children/${params.id}/plans/${params.planId}/edit`)
            }
          >
            تعديل
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          الهدف العلاجي العام
        </h2>
        <p className="text-gray-700">{plan.generalGoal}</p>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="html">معاينة HTML</TabsTrigger>
          {plan.stages.map((stage) => (
            <TabsTrigger key={stage.id} value={`stage-${stage.id}`}>
              المرحلة {stage.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {plan.stages.map((stage, idx) => (
            <Card key={stage.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    المرحلة {idx + 1}: {stage.title}
                  </h3>
                  <p className="text-sm text-gray-600">{stage.period}</p>
                </div>
                <Badge variant="outline">{stage.tasks.length} مهمة</Badge>
              </div>

              <div className="space-y-2">
                {stage.tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-semibold text-gray-900 ml-2">
                        {task.taskCode}
                      </span>
                      <span className="text-gray-700">{task.taskName}</span>
                    </div>
                    <Badge variant="secondary">درجة: {task.score}</Badge>
                  </div>
                ))}
                {stage.tasks.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    ... و {stage.tasks.length - 3} مهمة أخرى
                  </p>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="html">
          <Card className="p-6">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: plan.planHtml }}
            />
          </Card>
        </TabsContent>

        {plan.stages.map((stage) => (
          <TabsContent key={stage.id} value={`stage-${stage.id}`}>
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {stage.title}
              </h2>
              <p className="text-gray-600 mb-6">{stage.period}</p>

              <div className="space-y-4">
                {stage.tasks.map((task) => (
                  <Card key={task.id} className="p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="outline" className="ml-2">
                          {task.taskCode}
                        </Badge>
                        <span className="font-semibold text-gray-900">
                          {task.taskName}
                        </span>
                      </div>
                      <Badge>درجة: {task.score}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{task.goal}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

