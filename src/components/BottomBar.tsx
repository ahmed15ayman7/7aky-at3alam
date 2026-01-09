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
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  {
    title: "الرئيسية",
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
    title: "الخطط",
    href: "/plans/library",
    icon: FileText,
  },
];

export function BottomBar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-bottom"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all",
                isActive
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-[10px]">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

