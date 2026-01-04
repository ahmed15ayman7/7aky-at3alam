"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Building2, Users, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface Center {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  _count?: {
    children: number;
    therapists: number;
  };
}

export default function CentersPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await fetch("/api/centers");
      if (response.ok) {
        const data = await response.json();
        setCenters(data);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({ name: "", address: "", phone: "", email: "" });
        fetchCenters();
      }
    } catch (error) {
      console.error("Error creating center:", error);
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
          <h1 className="text-3xl font-bold">المراكز العلاجية</h1>
          <p className="text-muted-foreground mt-1">إدارة مراكز التخاطب والعلاج</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة مركز جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مركز جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المركز *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                حفظ
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Centers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {centers.map((center, index) => (
          <motion.div
            key={center.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{center.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {center.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{center.address}</span>
                  </div>
                )}
                {center.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{center.phone}</span>
                  </div>
                )}
                {center.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{center.email}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {center._count?.children || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">أطفال</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {center._count?.therapists || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">أخصائيين</div>
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

      {centers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد مراكز</h3>
            <p className="text-muted-foreground mb-4">ابدأ بإضافة مركز علاجي جديد</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة مركز
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

