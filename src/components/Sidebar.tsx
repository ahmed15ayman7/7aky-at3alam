"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserCog,
  FileText,
  BarChart3,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";

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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-l bg-background sticky top-0">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center border-b px-6 bg-gradient-to-br from-primary/5 to-yellow-50/50">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="relative h-12 w-12 flex-shrink-0"
          >
            <img 
              src="/logo.png" 
              alt="حقي أتعلم" 
              className="h-full w-full object-contain rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <span className="font-bold text-lg leading-tight bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
              حقي أتعلم
            </span>
            <span className="text-xs text-muted-foreground">نظام إدارة العلاج</span>
          </motion.div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Settings className="h-5 w-5" />
          الإعدادات
        </Link>
      </div>
    </aside>
  );
}

