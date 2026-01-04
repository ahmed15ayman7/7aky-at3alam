"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <FileQuestion className="h-24 w-24 text-primary opacity-20" />
            </div>
            <FileQuestion className="h-24 w-24 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="ml-2 h-4 w-4" />
              العودة للرئيسية
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            العودة للخلف
          </Button>
        </div>
      </div>
    </div>
  );
}

