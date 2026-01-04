import { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">حكي وتعلم</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">مرحباً بك</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar & Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                الصفحة الرئيسية
              </Link>
              <Link
                href="/children"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                الأطفال
              </Link>
              <Link
                href="/plans/library"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                مكتبة الخطط
              </Link>
              <Link
                href="/analytics"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                التحليلات
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

