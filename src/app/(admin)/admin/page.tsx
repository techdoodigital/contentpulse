"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Globe,
  FileText,
  Bell,
  Mail,
  AlertTriangle,
  Ticket,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalSites: number;
  totalPages: number;
  totalAlerts: number;
  newsletterSubs: number;
  subscriptionsByPlan: { free: number; starter: number; pro: number };
  recentAlerts: Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
    createdAt: string;
    page: {
      url: string;
      site: { siteUrl: string };
    };
  }>;
  recentTickets: Array<{
    id: string;
    subject: string;
    status: string;
    priority: string;
    category: string;
    createdAt: string;
    user: { name: string | null; email: string };
  }>;
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "text-red-400 bg-red-500/10";
    case "high":
      return "text-orange-400 bg-orange-500/10";
    case "medium":
      return "text-yellow-400 bg-yellow-500/10";
    default:
      return "text-blue-400 bg-blue-500/10";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "text-red-400 bg-red-500/10";
    case "medium":
      return "text-yellow-400 bg-yellow-500/10";
    default:
      return "text-green-400 bg-green-500/10";
  }
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return (
      <p className="text-slate-400 text-center py-20">
        Failed to load statistics.
      </p>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Total Sites",
      value: stats.totalSites,
      icon: Globe,
      color: "text-green-400",
    },
    {
      label: "Pages Tracked",
      value: stats.totalPages,
      icon: FileText,
      color: "text-purple-400",
    },
    {
      label: "Active Alerts",
      value: stats.totalAlerts,
      icon: Bell,
      color: "text-orange-400",
    },
    {
      label: "Newsletter Subs",
      value: stats.newsletterSubs,
      icon: Mail,
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-slate-400 mt-1">
          Platform statistics and recent activity
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{card.label}</p>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Subscription breakdown */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-sm font-semibold text-white mb-3">
          Subscriptions by Plan
        </h2>
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-bold text-white">
              {stats.subscriptionsByPlan.free}
            </p>
            <p className="text-xs text-slate-400">Free</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-400">
              {stats.subscriptionsByPlan.starter}
            </p>
            <p className="text-xs text-slate-400">Starter</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {stats.subscriptionsByPlan.pro}
            </p>
            <p className="text-xs text-slate-400">Pro</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent alerts */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            Recent Alerts
          </h2>
          {stats.recentAlerts.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              No alerts yet
            </p>
          ) : (
            <div className="space-y-2">
              {stats.recentAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg p-3 bg-slate-800/30"
                >
                  <span
                    className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getSeverityColor(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-300 truncate">
                      {alert.message}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {alert.page?.site?.siteUrl}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent tickets */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Ticket className="h-4 w-4 text-orange-400" />
            Open Tickets
          </h2>
          {stats.recentTickets.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              No open tickets
            </p>
          ) : (
            <div className="space-y-2">
              {stats.recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-start gap-3 rounded-lg p-3 bg-slate-800/30"
                >
                  <span
                    className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-300 truncate">
                      {ticket.subject}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {ticket.user.name || ticket.user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
