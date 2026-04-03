"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard,
  Activity,
  CreditCard,
  LogOut,
  Bell,
  HelpCircle,
  Settings,
  AlertTriangle,
  Check,
  Shield,
} from "lucide-react";

interface NotificationAlert {
  id: string;
  severity: string;
  message: string;
  read: boolean;
  createdAt: string;
  pageUrl: string;
  pageTitle: string | null;
  siteId: string;
  siteName: string;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/support", label: "Support", icon: HelpCircle },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || "User";
  const userRole = (session?.user as Record<string, unknown> | undefined)?.role as string | undefined;

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.alerts || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Silently fail
    }
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Silently fail
    }
  }

  function getSeverityDot(severity: string) {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-bold text-white">
                Content<span className="text-orange-500">Pulse</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-800 text-orange-400"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              {userRole === "admin" && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname.startsWith("/admin")
                      ? "bg-slate-800 text-orange-400"
                      : "text-orange-500/70 hover:bg-slate-800/50 hover:text-orange-400"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden z-50">
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <h3 className="text-sm font-semibold text-white">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
                      >
                        <Check className="h-3 w-3" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="mx-auto h-8 w-8 text-slate-600" />
                        <p className="mt-2 text-sm text-slate-500">
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <Link
                          key={notif.id}
                          href={`/site/${notif.siteId}`}
                          onClick={() => setShowDropdown(false)}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 ${
                            !notif.read ? "bg-slate-800/20" : ""
                          }`}
                        >
                          <div className="mt-1.5 shrink-0">
                            <div
                              className={`h-2 w-2 rounded-full ${getSeverityDot(
                                notif.severity
                              )}`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs leading-relaxed ${
                                notif.read
                                  ? "text-slate-400"
                                  : "text-slate-200"
                              }`}
                            >
                              {notif.message}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-600">
                              {notif.siteName} &middot;{" "}
                              {timeAgo(notif.createdAt)}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                          )}
                        </Link>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="border-t border-slate-800 px-4 py-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="text-xs text-orange-400 hover:text-orange-300"
                      >
                        View all sites
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/account"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === "/account"
                  ? "bg-slate-800 text-orange-400"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{userName}</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
