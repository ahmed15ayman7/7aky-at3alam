"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  taskCode: string;
  taskName: string;
  goal: string;
}

interface FormData {
  sessionDate: Date;
  duration: number;
  generalNotes: string;
  taskEvaluations: Array<{
    taskId: string;
    score: number;
    notes: string;
  }>;
}

export default function SessionDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskScores, setTaskScores] = useState<Record<string, number>>({});
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});
  const [generalNotes, setGeneralNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.sessionId !== "new") {
      fetchSession();
    } else {
      fetchActivePlanTasks();
    }
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/sessions/${params.sessionId}`);
      if (response.ok) {
        const session = await response.json();
        setGeneralNotes(session.generalNotes || "");
        
        // Load task evaluations
        const scores: Record<string, number> = {};
        const notes: Record<string, string> = {};
        session.taskEvaluations?.forEach((evaluation: any) => {
          scores[evaluation.taskId] = evaluation.score;
          notes[evaluation.taskId] = evaluation.notes || "";
        });
        setTaskScores(scores);
        setTaskNotes(notes);

        // Load tasks from therapy plan
        if (session.therapyPlan?.stages) {
          const allTasks = session.therapyPlan.stages.flatMap((stage: any) => stage.tasks);
          setTasks(allTasks);
        }
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  const fetchActivePlanTasks = async () => {
    try {
      const response = await fetch(`/api/plans?childId=${params.id}`);
      if (response.ok) {
        const plans = await response.json();
        const activePlan = plans.find((p: any) => p.isActive);
        
        if (activePlan?.stages) {
          const allTasks = activePlan.stages.flatMap((stage: any) => stage.tasks);
          setTasks(allTasks);
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const taskEvaluations = tasks.map((task) => ({
        taskId: task.id,
        score: taskScores[task.id] || 0,
        notes: taskNotes[task.id] || "",
      }));

      const overallProgress = Math.round(
        (taskEvaluations.reduce((sum, t) => sum + t.score, 0) / (tasks.length * 2)) * 100
      );

      if (params.sessionId === "new") {
        // Create new session
        const childResponse = await fetch(`/api/children/${params.id}`);
        const child = await childResponse.json();
        
        const plansResponse = await fetch(`/api/plans?childId=${params.id}`);
        const plans = await plansResponse.json();
        const activePlan = plans.find((p: any) => p.isActive);

        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childId: params.id,
            therapyPlanId: activePlan?.id,
            therapistId: child.therapistId,
            sessionDate: new Date(),
            duration: 45,
          }),
        });

        if (!response.ok) throw new Error("فشل في إنشاء الجلسة");
        
        const session = await response.json();
        
        // Update with evaluations
        await fetch(`/api/sessions/${session.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskEvaluations,
            generalNotes,
            overallProgress,
          }),
        });
      } else {
        // Update existing session
        await fetch(`/api/sessions/${params.sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskEvaluations,
            generalNotes,
            overallProgress,
          }),
        });
      }

      alert("تم حفظ الجلسة بنجاح!");
      router.push(`/children/${params.id}/sessions`);
    } catch (error: any) {
      console.error("Error saving session:", error);
      alert(error.message || "حدث خطأ أثناء حفظ الجلسة");
    } finally {
      setIsLoading(false);
    }
  };

  const overallProgress = tasks.length > 0
    ? Math.round((Object.values(taskScores).reduce((sum, score) => sum + score, 0) / (tasks.length * 2)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {params.sessionId === "new" ? "جلسة جديدة" : "تفاصيل الجلسة"}
          </h1>
          <p className="text-gray-600 mt-2">
            قم بتقييم أداء الطفل في كل مهمة
          </p>
        </div>
        <Badge className="text-lg px-4 py-2">
          التقدم الإجمالي: {overallProgress}%
        </Badge>
      </div>

      {/* Task Evaluations */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">تقييم المهام</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{task.taskCode}</Badge>
                    <span className="font-semibold text-gray-900">
                      {task.taskName}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{task.goal}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label className="text-sm mb-2 block">الدرجة</Label>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((score) => (
                      <button
                        key={score}
                        onClick={() =>
                          setTaskScores({ ...taskScores, [task.id]: score })
                        }
                        className={`px-4 py-2 rounded border ${
                          taskScores[task.id] === score
                            ? "bg-primary text-white border-primary"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm mb-2 block">ملاحظات</Label>
                  <Input
                    value={taskNotes[task.id] || ""}
                    onChange={(e) =>
                      setTaskNotes({ ...taskNotes, [task.id]: e.target.value })
                    }
                    placeholder="أضف ملاحظات..."
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* General Notes */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ملاحظات عامة</h2>
        <Textarea
          value={generalNotes}
          onChange={(e) => setGeneralNotes(e.target.value)}
          placeholder="أضف ملاحظات عامة عن الجلسة..."
          rows={4}
        />
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          إلغاء
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "جاري الحفظ..." : "حفظ الجلسة"}
        </Button>
      </div>
    </div>
  );
}

