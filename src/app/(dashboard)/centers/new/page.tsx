"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Building2, MapPin, Phone, Mail } from "lucide-react";

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

export default function NewCenterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  async function onSubmit(data: CenterFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("فشل في إضافة المركز");
      }

      router.push("/centers");
      router.refresh();
    } catch (error) {
      console.error("Error creating center:", error);
      alert("حدث خطأ أثناء إضافة المركز");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-8 h-8" />
          إضافة مركز جديد
        </h1>
        <p className="text-gray-600 mt-2">
          أدخل معلومات المركز الطبي الجديد
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
                  {isLoading ? "جاري الإضافة..." : "إضافة المركز"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

