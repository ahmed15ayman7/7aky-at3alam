"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, UserCog, Phone, Mail, Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface Therapist {
  id: string;
  name: string;
  email: string;
  phone?: string;
  center: {
    id: string;
    name: string;
  };
  _count?: {
    children: number;
    sessions: number;
  };
}

interface Center {
  id: string;
  name: string;
}

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    centerId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch therapists
      const therapistsRes = await fetch("/api/therapists");
      if (therapistsRes.ok) {
        const data = await therapistsRes.json();
        setTherapists(data);
      }

      // Fetch centers
      const centersRes = await fetch("/api/centers");
      if (centersRes.ok) {
        const data = await centersRes.json();
        setCenters(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/therapists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({ name: "", email: "", phone: "", centerId: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating therapist:", error);
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الأخصائيين</h1>
          <p className="text-muted-foreground mt-1">إدارة أخصائيي التخاطب</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة أخصائي جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة أخصائي جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="center">المركز *</Label>
                <Select
                  value={formData.centerId}
                  onValueChange={(value) => setFormData({ ...formData, centerId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المركز" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                حفظ
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Therapists Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {therapists.map((therapist, index) => (
          <motion.div
            key={therapist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-secondary/10">
                    <UserCog className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{therapist.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{therapist.email}</span>
                </div>
                {therapist.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{therapist.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{therapist.center.name}</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {therapist._count?.children || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">أطفال</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {therapist._count?.sessions || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">جلسات</div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-3">
                  عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {therapists.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <UserCog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا يوجد أخصائيين</h3>
            <p className="text-muted-foreground mb-4">ابدأ بإضافة أخصائي جديد</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة أخصائي
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

