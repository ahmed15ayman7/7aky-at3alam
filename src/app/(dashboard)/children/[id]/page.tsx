"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  Briefcase, 
  FileText,
  ClipboardList,
  ActivitySquare,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  address?: string;
  phone?: string;
  fatherJob?: string;
  motherJob?: string;
  center: {
    name: string;
  };
  therapist: {
    name: string;
  };
  assessments: any[];
  diagnoses: any[];
  therapyPlans: any[];
  sessions: any[];
}

export default function ChildDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChild();
  }, [params.id]);

  const fetchChild = async () => {
    try {
      const response = await fetch(`/api/children/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setChild(data);
      } else {
        router.push("/children");
      }
    } catch (error) {
      console.error("Error fetching child:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!child) {
    return null;
  }

  const activePlan = child.therapyPlans.find((p) => p.isActive);
  const latestDiagnosis = child.diagnoses[child.diagnoses.length - 1];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="h-8 w-8" />
            {child.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {child.gender === "male" ? "ذكر" : "أنثى"} • {child.age} سنوات
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/children/${child.id}/assessment`}>
              <ClipboardList className="ml-2 h-4 w-4" />
              التقييم
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/children/${child.id}/sessions`}>
              <ActivitySquare className="ml-2 h-4 w-4" />
              الجلسات
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ الميلاد</p>
                  <p className="font-medium">
                    {format(new Date(child.dateOfBirth), "dd MMMM yyyy", { locale: ar })}
                  </p>
                </div>
              </div>
              {child.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">العنوان</p>
                    <p className="font-medium">{child.address}</p>
                  </div>
                </div>
              )}
              {child.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">الهاتف</p>
                    <p className="font-medium">{child.phone}</p>
                  </div>
                </div>
              )}
              {(child.fatherJob || child.motherJob) && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">مهنة الوالدين</p>
                    <p className="font-medium">
                      {child.fatherJob && `الأب: ${child.fatherJob}`}
                      {child.fatherJob && child.motherJob && " • "}
                      {child.motherJob && `الأم: ${child.motherJob}`}
                    </p>
                  </div>
                </div>
              )}
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">المركز</p>
                <p className="font-medium">{child.center.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">الأخصائي</p>
                <p className="font-medium">{child.therapist.name}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Diagnosis Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">التشخيص</CardTitle>
            </CardHeader>
            <CardContent>
              {latestDiagnosis ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">التشخيص النهائي</p>
                    <p className="font-medium">{latestDiagnosis.finalDiagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">مستوى الشدة</p>
                    <Badge
                      variant={
                        latestDiagnosis.severityLevel === "خفيف"
                          ? "default"
                          : latestDiagnosis.severityLevel === "متوسط"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {latestDiagnosis.severityLevel}
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/children/${child.id}/diagnosis`}>
                      عرض التفاصيل
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">لم يتم التشخيص بعد</p>
                  <Button asChild>
                    <Link href={`/children/${child.id}/assessment`}>
                      بدء التقييم
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الخطة العلاجية النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              {activePlan ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">عنوان الخطة</p>
                    <p className="font-medium">{activePlan.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">الهدف العام</p>
                    <p className="text-sm line-clamp-3">{activePlan.generalGoal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">المدة</p>
                    <Badge>{activePlan.duration}</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/children/${child.id}/plans/${activePlan.id}`}>
                      عرض الخطة
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">لا توجد خطة نشطة</p>
                  <Button asChild disabled={!latestDiagnosis}>
                    <Link href={`/children/${child.id}/plans`}>
                      إنشاء خطة
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <ClipboardList className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-3xl font-bold">{child.assessments.length}</div>
              <p className="text-sm text-muted-foreground">تقييمات</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto text-secondary mb-2" />
              <div className="text-3xl font-bold">{child.diagnoses.length}</div>
              <p className="text-sm text-muted-foreground">تشخيصات</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold">{child.therapyPlans.length}</div>
              <p className="text-sm text-muted-foreground">خطط علاجية</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <ActivitySquare className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <div className="text-3xl font-bold">{child.sessions.length}</div>
              <p className="text-sm text-muted-foreground">جلسات</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

