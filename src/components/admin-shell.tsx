"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Ticket,
  Tag,
  ArrowLeft,
  Shield,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
];

export default function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 border-b border-slate-800 px-6 py-5">
          <Shield className="h-5 w-5 text-orange-500" />
          <span className="text-lg font-bold text-white">Admin Panel</span>
        </div>
        <div className="px-4 py-3 border-b border-slate-800">
          <p className="text-xs text-slate-500">Signed in as</p>
          <p className="text-sm font-medium text-slate-200 truncate">
            {userName}
          </p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-800 px-3 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="md:hidden sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <span className="text-lg font-bold text-white">Admin</span>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <nav className="flex gap-1 px-3 pb-3 overflow-x-auto">
            {adminNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
