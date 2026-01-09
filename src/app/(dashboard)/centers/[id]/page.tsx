"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Building2, MapPin, Phone, Mail, Loader2 } from "lucide-react";

const centerSchema = z.object({
  name: z.string().min(2, "يجب أن يكون اسم المركز على الأقل حرفين"),
  address: z.string().min(5, "يجب إدخال العنوان بالكامل"),
  phone: z.string().min(10, "يجب إدخال رقم هاتف صحيح"),
  email: z.string().email("يجب إدخال بريد إلكتروني صحيح"),
  licenseNumber: z.string().optional(),
  description: z.string().optional(),
});

type CenterFormValues = z.infer<typeof centerSchema>;

export const dynamic = 'force-dynamic';

export default function CenterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const centerId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

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
        const data = await response.json();
        form.reset(data);
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-8 h-8" />
          تعديل بيانات المركز
        </h1>
        <p className="text-gray-600 mt-2">
          تحديث معلومات المركز الطبي
        </p>
      </div>

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

