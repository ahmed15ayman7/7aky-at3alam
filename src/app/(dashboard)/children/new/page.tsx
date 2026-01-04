"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { childFormSchema, type ChildFormValues } from "@/lib/utils/validators";

function CancelButton({ isLoading, onCancel }: { isLoading: boolean; onCancel: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={isLoading}
      onClick={onCancel}
    >
      إلغاء
    </Button>
  );
}

export default function NewChildPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      name: "",
      gender: "male" as const,
      address: "",
      fatherJob: "",
      motherJob: "",
      phone: "",
      hasRelativeIssue: false,
      centerId: "temp-center-id", // TODO: Replace with actual center ID
      therapistId: "temp-therapist-id", // TODO: Replace with actual therapist ID
    },
  });

  const onSubmit = async (data: ChildFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في إضافة الطفل");
      }

      const child = await response.json();
      router.push(`/children/${child.id}`);
    } catch (error: any) {
      console.error("Error creating child:", error);
      alert(error.message || "حدث خطأ أثناء إضافة الطفل");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">إضافة طفل جديد</h1>
        <p className="text-gray-600 mt-2">املأ البيانات الأساسية للطفل</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الطفل</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم الطفل" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاريخ الميلاد</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الجنس</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الجنس" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل العنوان" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fatherJob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وظيفة الأب</FormLabel>
                    <FormControl>
                      <Input placeholder="وظيفة الأب" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motherJob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وظيفة الأم</FormLabel>
                    <FormControl>
                      <Input placeholder="وظيفة الأم" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input placeholder="رقم الهاتف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-end">
              <CancelButton isLoading={isLoading} onCancel={() => router.back()} />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "جاري الإضافة..." : "إضافة الطفل"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

