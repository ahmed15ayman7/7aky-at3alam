"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Phone, Mail, Briefcase } from "lucide-react";

const therapistSchema = z.object({
  name: z.string().min(2, "يجب أن يكون الاسم على الأقل حرفين"),
  email: z.string().email("يجب إدخال بريد إلكتروني صحيح"),
  phone: z.string().min(10, "يجب إدخال رقم هاتف صحيح"),
  specialization: z.string().min(2, "يجب إدخال التخصص"),
  licenseNumber: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0, "يجب أن يكون عدد سنوات الخبرة 0 أو أكثر"),
  centerId: z.string().min(1, "يجب اختيار المركز"),
});

type TherapistFormValues = z.infer<typeof therapistSchema>;

interface Center {
  id: string;
  name: string;
}

export const dynamic = 'force-dynamic';

export default function NewTherapistPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [centers, setCenters] = useState<Center[]>([]);

  const form = useForm({
    resolver: zodResolver(therapistSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
      licenseNumber: "",
      yearsOfExperience: 0,
      centerId: "",
    },
  });

  useEffect(() => {
    async function fetchCenters() {
      try {
        const response = await fetch("/api/centers");
        if (response.ok) {
          const data = await response.json();
          setCenters(data);
        }
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    }
    fetchCenters();
  }, []);

  async function onSubmit(data: TherapistFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/therapists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في إضافة الأخصائي");
      }

      toast.success("تم إضافة الأخصائي بنجاح!", {
        description: `تم إضافة ${data.name} إلى النظام`,
      });
      router.push("/therapists");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating therapist:", error);
      toast.error("خطأ في إضافة الأخصائي", {
        description: error.message || "حدث خطأ أثناء إضافة الأخصائي",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <UserPlus className="w-8 h-8" />
          إضافة معالج جديد
        </h1>
        <p className="text-gray-600 mt-2">
          أدخل معلومات المعالج الجديد
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المعالج</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الكامل *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserPlus className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="د. أحمد محمد"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="doctor@example.com"
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
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التخصص *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="أخصائي تخاطب"
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
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>سنوات الخبرة *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          value={field.value as number}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
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
                      <Input placeholder="رقم الترخيص المهني" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="centerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المركز *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المركز" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {centers.map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            {center.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => router.back()}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "جاري الإضافة..." : "إضافة المعالج"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

