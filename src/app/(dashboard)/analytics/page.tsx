"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  plansByDiagnosis: Array<{ diagnosis: string; count: number }>;
  sessionsByMonth: Array<{ month: string; count: number }>;
  progressByCenter: Array<{ center: string; avgProgress: number }>;
  topPerformingPlans: Array<{ planTitle: string; avgScore: number }>;
}

const COLORS = ["#cebc09", "#0c53b1", "#10b981", "#f59e0b", "#ef4444"];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">لا توجد بيانات للتحليل</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">التحليلات والتقارير</h1>
        <p className="text-gray-600 mt-2">
          تحليل شامل لأداء البرامج العلاجية وتقدم الأطفال
        </p>
      </div>

      {/* Plans by Diagnosis */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          توزيع الخطط حسب التشخيص
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.plansByDiagnosis}
              dataKey="count"
              nameKey="diagnosis"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {analytics.plansByDiagnosis.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Sessions by Month */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          الجلسات الشهرية
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.sessionsByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0c53b1"
              strokeWidth={2}
              name="عدد الجلسات"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Progress by Center */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          متوسط التقدم حسب المركز
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.progressByCenter}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="center" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="avgProgress"
              fill="#cebc09"
              name="متوسط التقدم (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Performing Plans */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          الخطط الأكثر نجاحاً
        </h2>
        <div className="space-y-3">
          {analytics.topPerformingPlans.map((plan, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Badge className="bg-primary">{idx + 1}</Badge>
                <span className="font-semibold text-gray-900">
                  {plan.planTitle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {plan.avgScore.toFixed(1)}
                </span>
                <span className="text-sm text-gray-600">/ 2</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

