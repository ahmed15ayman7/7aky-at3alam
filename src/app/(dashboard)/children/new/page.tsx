"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { childFormSchema, type ChildFormValues } from "@/lib/utils/validators";

export const dynamic = 'force-dynamic';

interface Center {
  id: string;
  name: string;
}

interface Therapist {
  id: string;
  name: string;
  centerId: string;
  specialization: string;
}

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
  const [centers, setCenters] = useState<Center[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);

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
      centerId: "",
      therapistId: "",
    },
  });

  // Fetch centers and therapists
  useEffect(() => {
    async function fetchData() {
      try {
        const [centersRes, therapistsRes] = await Promise.all([
          fetch("/api/centers"),
          fetch("/api/therapists"),
        ]);

        if (centersRes.ok) {
          const centersData = await centersRes.json();
          setCenters(centersData);
        }

        if (therapistsRes.ok) {
          const therapistsData = await therapistsRes.json();
          setTherapists(therapistsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // Filter therapists based on selected center
  const selectedCenterId = form.watch("centerId");
  useEffect(() => {
    if (selectedCenterId) {
      const filtered = therapists.filter(t => t.centerId === selectedCenterId);
      setFilteredTherapists(filtered);
      
      // Reset therapist selection if current therapist is not in filtered list
      const currentTherapistId = form.getValues("therapistId");
      if (currentTherapistId && !filtered.some(t => t.id === currentTherapistId)) {
        form.setValue("therapistId", "");
      }
    } else {
      setFilteredTherapists([]);
      form.setValue("therapistId", "");
    }
  }, [selectedCenterId, therapists, form]);

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
      toast.success("تم إضافة الطفل بنجاح!", {
        description: `تم إضافة ${data.name} إلى النظام`,
      });
      router.push(`/children/${child.id}`);
    } catch (error: any) {
      console.error("Error creating child:", error);
      toast.error("خطأ في إضافة الطفل", {
        description: error.message || "حدث خطأ أثناء إضافة الطفل",
      });
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
                  <FormLabel>اسم الطفل *</FormLabel>
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
                  <FormLabel>تاريخ الميلاد *</FormLabel>
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
                  <FormLabel>الجنس *</FormLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="centerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المركز *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المركز" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {centers.length === 0 ? (
                          <SelectItem value="no-centers" disabled>
                            لا توجد مراكز متاحة
                          </SelectItem>
                        ) : (
                          centers.map((center) => (
                            <SelectItem key={center.id} value={center.id}>
                              {center.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      اختر المركز الذي ينتمي إليه الطفل
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="therapistId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأخصائي *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedCenterId || filteredTherapists.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !selectedCenterId 
                              ? "اختر المركز أولاً" 
                              : filteredTherapists.length === 0
                              ? "لا يوجد أخصائيون في هذا المركز"
                              : "اختر الأخصائي"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredTherapists.map((therapist) => (
                          <SelectItem key={therapist.id} value={therapist.id}>
                            {therapist.name} - {therapist.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      اختر الأخصائي المسؤول عن الطفل
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <FormField
              control={form.control}
              name="hasRelativeIssue"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none pr-3">
                    <FormLabel>
                      يوجد مشكلة مماثلة في العائلة
                    </FormLabel>
                    <FormDescription>
                      حدد هذا الخيار إذا كان هناك حالات مماثلة في العائلة
                    </FormDescription>
                  </div>
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
