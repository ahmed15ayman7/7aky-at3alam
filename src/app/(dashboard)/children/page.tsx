"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  createdAt: string;
  therapist: {
    name: string;
  };
  diagnoses: Array<{
    finalDiagnosis: string;
    severityLevel: string;
  }>;
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await fetch("/api/children");
      if (response.ok) {
        const data = await response.json();
        setChildren(data);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الأطفال</h1>
          <p className="text-gray-600 mt-2">
            إدارة بيانات الأطفال والخطط العلاجية
          </p>
        </div>
        <Link href="/children/new">
          <Button>إضافة طفل جديد</Button>
        </Link>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">لا يوجد أطفال مسجلين</p>
            <Link href="/children/new">
              <Button>إضافة أول طفل</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>العمر</TableHead>
                <TableHead>الجنس</TableHead>
                <TableHead>الأخصائي</TableHead>
                <TableHead>التشخيص</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {children.map((child) => (
                <TableRow key={child.id}>
                  <TableCell className="font-medium">{child.name}</TableCell>
                  <TableCell>{child.age} سنة</TableCell>
                  <TableCell>
                    {child.gender === "male" ? "ذكر" : "أنثى"}
                  </TableCell>
                  <TableCell>{child.therapist.name}</TableCell>
                  <TableCell>
                    {child.diagnoses.length > 0 ? (
                      <div className="flex gap-2 items-center">
                        <span className="text-sm">
                          {child.diagnoses[0].finalDiagnosis.substring(0, 30)}
                          ...
                        </span>
                        <Badge variant="outline">
                          {child.diagnoses[0].severityLevel}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-gray-400">لم يتم التشخيص</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/children/${child.id}`}>
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

