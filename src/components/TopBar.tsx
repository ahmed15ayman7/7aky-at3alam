"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserCog,
  FileText,
  BarChart3,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "لوحة التحكم",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "الأطفال",
    href: "/children",
    icon: Users,
  },
  {
    title: "المراكز",
    href: "/centers",
    icon: Building2,
  },
  {
    title: "الأخصائيين",
    href: "/therapists",
    icon: UserCog,
  },
  {
    title: "مكتبة الخطط",
    href: "/plans/library",
    icon: FileText,
  },
  {
    title: "التحليلات",
    href: "/analytics",
    icon: BarChart3,
  },
];

export function TopBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 md:hidden h-16 shadow-sm"
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-3">
                <div className="relative h-10 w-10 flex-shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="حقي أتعلم" 
                    className="h-full w-full object-contain rounded-lg"
                  />
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-bold text-base">حقي أتعلم</span>
                  <span className="text-xs text-muted-foreground font-normal">نظام إدارة العلاج</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                );
              })}
              
              <div className="border-t my-2" />
              
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Settings className="h-5 w-5" />
                الإعدادات
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-10 w-10 flex-shrink-0"
          >
            <img 
              src="/logo.png" 
              alt="حقي أتعلم" 
              className="h-full w-full object-contain rounded-lg"
            />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-bold text-lg hidden xs:block bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent"
          >
            حقي أتعلم
          </motion.span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

