"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TherapyPlan {
  id: string;
  title: string;
  diagnosis: {
    finalDiagnosis: string;
  };
  child: {
    id: string;
    name: string;
  };
  createdAt: string;
  isActive: boolean;
}

export default function PlansLibraryPage() {
  const [plans, setPlans] = useState<TherapyPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDiagnosis, setFilterDiagnosis] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.child.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiagnosis =
      filterDiagnosis === "all" ||
      plan.diagnosis?.finalDiagnosis === filterDiagnosis;

    return matchesSearch && matchesDiagnosis;
  });

  const uniqueDiagnoses = Array.from(
    new Set(plans.map((p) => p.diagnosis?.finalDiagnosis).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            مكتبة الخطط العلاجية
          </h1>
          <p className="text-gray-600 mt-2">
            تصفح وابحث في جميع الخطط العلاجية المحفوظة
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <Input
            placeholder="ابحث في الخطط..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <select
            value={filterDiagnosis}
            onChange={(e) => setFilterDiagnosis(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">جميع التشخيصات</option>
            {uniqueDiagnoses.map((diagnosis) => (
              <option key={diagnosis} value={diagnosis}>
                {diagnosis}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد خطط مطابقة للبحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {plan.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      الطفل: {plan.child.name}
                    </p>
                  </div>
                  {plan.isActive && (
                    <Badge className="bg-green-500">نشطة</Badge>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <Badge variant="outline">
                    {plan.diagnosis?.finalDiagnosis || "غير محدد"}
                  </Badge>
                  <p className="text-sm text-gray-500">
                    تاريخ الإنشاء:{" "}
                    {new Date(plan.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/children/${plan.child.id}/plans/${plan.id}`}>
                    عرض الخطة
                  </Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

