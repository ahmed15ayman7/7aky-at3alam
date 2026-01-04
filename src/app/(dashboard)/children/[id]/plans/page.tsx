"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TherapyPlan {
  id: string;
  planNumber: number;
  title: string;
  generalGoal: string;
  isActive: boolean;
  isAiGenerated: boolean;
  createdAt: string;
}

export default function TherapyPlansPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [plans, setPlans] = useState<TherapyPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
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
    }
  };

  const generatePlans = async () => {
    if (!diagnosisId) {
      alert("لم يتم العثور على تشخيص للطفل");
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
        throw new Error(error.error || "فشل في توليد الخطط");
      }

      await fetchPlans();
      alert("تم توليد الخطط العلاجية بنجاح!");
    } catch (error: any) {
      console.error("Error generating plans:", error);
      alert(error.message || "حدث خطأ أثناء توليد الخطط");
    } finally {
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

        {plans.length === 0 && (
          <Button onClick={generatePlans} disabled={isGenerating}>
            {isGenerating ? "جاري التوليد..." : "توليد 4 خطط علاجية"}
          </Button>
        )}
      </div>

      {isGenerating && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">
            جاري توليد الخطط العلاجية... قد يستغرق هذا عدة دقائق
          </p>
        </Card>
      )}

      {plans.length === 0 && !isGenerating && (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">لم يتم توليد خطط علاجية بعد</p>
          <Button onClick={generatePlans}>توليد الخطط</Button>
        </Card>
      )}

      {plans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6">
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

              <p className="text-gray-700 mb-4">{plan.generalGoal}</p>

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

