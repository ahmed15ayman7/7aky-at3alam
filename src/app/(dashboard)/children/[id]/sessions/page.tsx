"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Session {
  id: string;
  sessionNumber: number;
  sessionDate: string;
  duration: number;
  overallProgress?: number;
  generalNotes?: string;
}

export default function SessionsPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/sessions?childId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const averageProgress =
    sessions.length > 0
      ? sessions
          .filter((s) => s.overallProgress !== null)
          .reduce((sum, s) => sum + (s.overallProgress || 0), 0) /
        sessions.filter((s) => s.overallProgress !== null).length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الجلسات العلاجية</h1>
          <p className="text-gray-600 mt-2">
            تتبع جلسات الطفل وتقييم التقدم
          </p>
        </div>
        <Button onClick={() => router.push(`/children/${params.id}/sessions/new`)}>
          إضافة جلسة جديدة
        </Button>
      </div>

      {/* Progress Overview */}
      {sessions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            ملخص التقدم
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">إجمالي الجلسات</p>
              <p className="text-3xl font-bold text-gray-900">{sessions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">متوسط التقدم</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-gray-900">
                  {averageProgress.toFixed(0)}%
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">التقدم العام</p>
              <Progress value={averageProgress} className="w-full" />
            </div>
          </div>
        </Card>
      )}

      {/* Sessions Table */}
      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">لم يتم تسجيل جلسات بعد</p>
            <Button onClick={() => router.push(`/children/${params.id}/sessions/new`)}>
              إضافة أول جلسة
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الجلسة</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>المدة</TableHead>
                <TableHead>التقدم</TableHead>
                <TableHead>الملاحظات</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    الجلسة {session.sessionNumber}
                  </TableCell>
                  <TableCell>
                    {new Date(session.sessionDate).toLocaleDateString("ar-EG")}
                  </TableCell>
                  <TableCell>{session.duration} دقيقة</TableCell>
                  <TableCell>
                    {session.overallProgress !== null && session.overallProgress !== undefined ? (
                      <div className="flex items-center gap-2">
                        <Progress value={session.overallProgress} className="w-20" />
                        <span className="text-sm">{session.overallProgress}%</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">لم يتم التقييم</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {session.generalNotes ? (
                      <span className="text-sm text-gray-600">
                        {session.generalNotes.substring(0, 50)}...
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/children/${params.id}/sessions/${session.id}`}>
                      <Button variant="outline" size="sm">
                        عرض التفاصيل
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

