import { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop Only */}
      <Sidebar />
      
      {/* TopBar - Mobile Only */}
      <TopBar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 pb-20 md:pt-0 md:pb-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* Bottom Bar - Mobile Only */}
      <BottomBar />
    </div>
  );
}
