"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Globe,
  RefreshCw,
  AlertTriangle,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";

interface Site {
  id: string;
  siteUrl: string;
  displayName: string | null;
  lastSyncedAt: string | null;
  _count: { pages: number };
}

interface GSCSite {
  siteUrl: string;
  permissionLevel: string;
}

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [gscSites, setGscSites] = useState<GSCSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [loadingGsc, setLoadingGsc] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    try {
      const res = await fetch("/api/sites");
      const data = await res.json();
      setSites(data.sites || []);
    } catch {
      console.error("Failed to fetch sites");
    } finally {
      setLoading(false);
    }
  }

  async function fetchGSCSites() {
    setLoadingGsc(true);
    try {
      const res = await fetch("/api/gsc-sites");
      const data = await res.json();
      setGscSites(data.sites || []);
    } catch {
      console.error("Failed to fetch GSC sites");
    } finally {
      setLoadingGsc(false);
    }
  }

  async function addSite(siteUrl: string) {
    setAdding(true);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteUrl }),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchSites();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add site");
      }
    } catch {
      alert("Failed to add site");
    } finally {
      setAdding(false);
    }
  }

  function openAddModal() {
    setShowAddModal(true);
    fetchGSCSites();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Sites</h1>
          <p className="mt-1 text-sm text-slate-400">
            Connect your Google Search Console properties to monitor content
            health.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500"
        >
          <Plus className="h-4 w-4" />
          Add Site
        </button>
      </div>

      {sites.length === 0 ? (
        <div className="space-y-6">
          {/* Main empty state CTA */}
          <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center">
            <Globe className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="mt-4 text-lg font-semibold text-white">
              No sites connected yet
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
              Connect a Google Search Console property to start monitoring your
              content health. ContentPulse will detect decaying pages and give
              you AI-powered recovery plans.
            </p>
            <button
              onClick={openAddModal}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-500"
            >
              <Plus className="h-4 w-4" />
              Add Your First Site
            </button>
          </div>

          {/* Getting started steps */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">
              Getting Started
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Connect a site",
                  description:
                    "Click \"Add Site\" and select a property from your Google Search Console.",
                },
                {
                  step: "2",
                  title: "Sync your data",
                  description:
                    "ContentPulse pulls page performance data from GSC. Your first sync takes a few seconds.",
                },
                {
                  step: "3",
                  title: "Review decay alerts",
                  description:
                    "Pages losing traffic are flagged with severity scores. Use AI analysis for recovery steps.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xs font-bold text-orange-500">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help links */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/help"
              className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4 text-sm text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            >
              <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
              <div>
                <p className="font-medium text-white">
                  Which Google account should I use?
                </p>
                <p className="text-xs text-slate-500">
                  Make sure you sign in with the right account
                </p>
              </div>
            </Link>
            <Link
              href="/what-is-content-decay"
              className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4 text-sm text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            >
              <FileText className="h-4 w-4 text-orange-500 shrink-0" />
              <div>
                <p className="font-medium text-white">
                  What is content decay?
                </p>
                <p className="text-xs text-slate-500">
                  Learn how it affects your search traffic
                </p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Link
              key={site.id}
              href={`/site/${site.id}`}
              className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-orange-500/30 hover:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <Globe className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-orange-400">
                      {site.displayName || site.siteUrl}
                    </h3>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">
                      {site.siteUrl}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  {site._count.pages} pages
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {site.lastSyncedAt
                    ? `Synced ${new Date(site.lastSyncedAt).toLocaleDateString()}`
                    : "Never synced"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add site modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white">
              Add a Site from Google Search Console
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Select a property from your Search Console account.
            </p>

            <div className="mt-4 max-h-64 overflow-y-auto">
              {loadingGsc ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  <span className="ml-2 text-sm text-slate-400">
                    Loading your Search Console sites...
                  </span>
                </div>
              ) : gscSites.length === 0 ? (
                <div className="py-8 text-center">
                  <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500" />
                  <p className="mt-2 text-sm text-slate-400">
                    No sites found. Make sure you have properties in Google
                    Search Console.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {gscSites.map((gscSite) => {
                    const alreadyAdded = sites.some(
                      (s) => s.siteUrl === gscSite.siteUrl
                    );
                    return (
                      <button
                        key={gscSite.siteUrl}
                        onClick={() => !alreadyAdded && addSite(gscSite.siteUrl)}
                        disabled={alreadyAdded || adding}
                        className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                          alreadyAdded
                            ? "border-slate-700 bg-slate-800/50 text-slate-500 cursor-not-allowed"
                            : "border-slate-700 bg-slate-800 text-white hover:border-orange-500/50 hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">{gscSite.siteUrl}</span>
                        </div>
                        {alreadyAdded ? (
                          <span className="text-xs text-slate-500">Added</span>
                        ) : adding ? (
                          <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                        ) : (
                          <Plus className="h-4 w-4 text-orange-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
