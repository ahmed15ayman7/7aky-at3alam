"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlanEditor } from "@/components/plans/PlanEditor";

interface Task {
  id: string;
  taskCode: string;
  taskName: string;
  goal: string;
  question: string;
  examples: string;
  performanceCriteria: string;
  score: number;
  notes?: string;
  order: number;
}

interface Stage {
  id: string;
  title: string;
  period: string;
  tasks: Task[];
}

export default function EditPlanPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string; planId: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const response = await fetch(`/api/plans/${params.planId}`);
      if (response.ok) {
        const plan = await response.json();
        setStages(plan.stages || []);
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (updatedStages: Stage[]) => {
    // Update stages
    for (const stage of updatedStages) {
      await fetch(`/api/plans/${params.planId}/stages/${stage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: stage.title,
          period: stage.period,
        }),
      });

      // Update tasks
      for (const task of stage.tasks) {
        await fetch(`/api/plans/${params.planId}/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        });
      }
    }

    router.push(`/children/${params.id}/plans/${params.planId}`);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">تعديل الخطة العلاجية</h1>
        <p className="text-gray-600 mt-2">
          قم بتعديل المهام، إعادة ترتيبها، أو حذفها
        </p>
      </div>

      <PlanEditor
        planId={params.planId}
        initialStages={stages}
        onSave={handleSave}
      />
    </div>
  );
}

