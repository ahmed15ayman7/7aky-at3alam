"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Building2, MapPin, Phone, Mail, Loader2, Users, ChevronLeft, Calendar, UserCog } from "lucide-react";

const centerSchema = z.object({
  name: z.string().min(2, "يجب أن يكون اسم المركز على الأقل حرفين"),
  address: z.string().min(5, "يجب إدخال العنوان بالكامل"),
  phone: z.string().min(10, "يجب إدخال رقم هاتف صحيح"),
  email: z.string().email("يجب إدخال بريد إلكتروني صحيح"),
  licenseNumber: z.string().optional(),
  description: z.string().optional(),
});

type CenterFormValues = z.infer<typeof centerSchema>;

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  therapist: {
    name: string;
  };
  therapyPlans: Array<{
    id: string;
    isActive: boolean;
  }>;
}

interface CenterData extends CenterFormValues {
  children?: Child[];
}

export const dynamic = 'force-dynamic';

export default function CenterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const centerId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);

  const form = useForm<CenterFormValues>({
    resolver: zodResolver(centerSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      licenseNumber: "",
      description: "",
    },
  });

  useEffect(() => {
    async function fetchCenter() {
      try {
        const response = await fetch(`/api/centers/${centerId}`);
        if (!response.ok) {
          throw new Error("فشل في تحميل بيانات المركز");
        }
        const data: CenterData = await response.json();
        form.reset(data);
        
        // Set children if available
        if (data.children) {
          setChildren(data.children);
        }
      } catch (error) {
        console.error("Error fetching center:", error);
        alert("حدث خطأ أثناء تحميل بيانات المركز");
      } finally {
        setIsFetching(false);
      }
    }

    fetchCenter();
  }, [centerId, form]);

  async function onSubmit(data: CenterFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/centers/${centerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("فشل في تحديث المركز");
      }

      router.push("/centers");
      router.refresh();
    } catch (error) {
      console.error("Error updating center:", error);
      alert("حدث خطأ أثناء تحديث المركز");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("هل أنت متأكد من حذف هذا المركز؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/centers/${centerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("فشل في حذف المركز");
      }

      router.push("/centers");
      router.refresh();
    } catch (error) {
      console.error("Error deleting center:", error);
      alert("حدث خطأ أثناء حذف المركز");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
          تعديل بيانات المركز
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          تحديث معلومات المركز الطبي
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الأطفال</p>
                <p className="text-2xl font-bold text-gray-900">{children.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الخطط النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {children.filter(c => c.therapyPlans.some(p => p.isActive)).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الأخصائيون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(children.map(c => c.therapist.name)).size}
                </p>
              </div>
              <UserCog className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children List */}
      {children.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              الأطفال المسجلون ({children.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {children.map((child) => (
                <Link key={child.id} href={`/children/${child.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">
                        {child.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 truncate">{child.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {child.age} سنوات
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {child.gender === "male" ? "ذكر" : "أنثى"}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 truncate">
                            {child.therapist.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {child.therapyPlans.some(p => p.isActive) && (
                          <Badge variant="default" className="text-xs">
                            خطة نشطة
                          </Badge>
                        )}
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات المركز</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المركز *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="مركز حكي وتعلم للتخاطب"
                          className="pr-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="شارع، حي، مدينة"
                          className="pr-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="01xxxxxxxxx"
                            className="pr-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="info@center.com"
                            className="pr-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الترخيص</FormLabel>
                    <FormControl>
                      <Input placeholder="رقم الترخيص الطبي" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وصف المركز</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="نبذة عن المركز وخدماته"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isLoading}
                  onClick={handleDelete}
                >
                  حذف المركز
                </Button>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => router.back()}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

