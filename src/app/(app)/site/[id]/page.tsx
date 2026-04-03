"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Sparkles,
  ArrowDown,
  ArrowUp,
  Minus,
  Download,
} from "lucide-react";

interface Snapshot {
  id: string;
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  createdAt: string;
}

interface Analysis {
  id: string;
  decayScore: number;
  summary: string;
  recommendations: string;
  createdAt: string;
}

interface Page {
  id: string;
  url: string;
  title: string | null;
  snapshots: Snapshot[];
  alerts: Alert[];
  analyses: Analysis[];
  _count: { analyses: number };
}

interface Site {
  id: string;
  siteUrl: string;
  displayName: string | null;
  lastSyncedAt: string | null;
  pages: Page[];
}

interface DecayResult {
  pageId: string;
  url: string;
  decayScore: number;
  clicksChange: number;
  impressionsChange: number;
  positionChange: number;
  ctrChange: number;
  severity: string;
  recentClicks: number;
  previousClicks: number;
}

function computeDecayFromSnapshots(pages: Page[]): DecayResult[] {
  const results: DecayResult[] = [];

  for (const page of pages) {
    // If we have a pre-computed analysis, use its decay score
    if (page.analyses && page.analyses.length > 0) {
      const analysis = page.analyses[0];
      if (analysis.decayScore > 15) {
        // Still compute changes from snapshots for the table
        const snapshots = [...page.snapshots].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const midpoint = Math.floor(snapshots.length / 2);
        const recentSnaps = snapshots.slice(midpoint);
        const previousSnaps = snapshots.slice(0, midpoint);

        const avg = (arr: Snapshot[]) => {
          if (arr.length === 0) return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
          return {
            clicks: arr.reduce((s, a) => s + a.clicks, 0) / arr.length,
            impressions: arr.reduce((s, a) => s + a.impressions, 0) / arr.length,
            ctr: arr.reduce((s, a) => s + a.ctr, 0) / arr.length,
            position: arr.reduce((s, a) => s + a.position, 0) / arr.length,
          };
        };

        const recent = avg(recentSnaps);
        const previous = avg(previousSnaps);

        const clicksChange = previous.clicks > 0
          ? ((recent.clicks - previous.clicks) / previous.clicks) * 100
          : 0;
        const impressionsChange = previous.impressions > 0
          ? ((recent.impressions - previous.impressions) / previous.impressions) * 100
          : 0;
        const positionChange = recent.position - previous.position;
        const ctrChange = recent.ctr - previous.ctr;

        let severity = "low";
        if (analysis.decayScore >= 70) severity = "critical";
        else if (analysis.decayScore >= 50) severity = "high";
        else if (analysis.decayScore >= 30) severity = "medium";

        results.push({
          pageId: page.id,
          url: page.url,
          decayScore: analysis.decayScore,
          clicksChange: Math.round(clicksChange),
          impressionsChange: Math.round(impressionsChange),
          positionChange: Math.round(positionChange * 10) / 10,
          ctrChange: Math.round(ctrChange * 10000) / 100,
          severity,
          recentClicks: Math.round(recent.clicks),
          previousClicks: Math.round(previous.clicks),
        });
      }
      continue;
    }

    // Fallback: compute from snapshots only
    if (page.snapshots.length < 2) continue;

    const snapshots = [...page.snapshots].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const midpoint = Math.floor(snapshots.length / 2);
    const recentSnaps = snapshots.slice(midpoint);
    const previousSnaps = snapshots.slice(0, midpoint);

    const avg = (arr: Snapshot[]) => {
      if (arr.length === 0) return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
      return {
        clicks: arr.reduce((s, a) => s + a.clicks, 0) / arr.length,
        impressions: arr.reduce((s, a) => s + a.impressions, 0) / arr.length,
        ctr: arr.reduce((s, a) => s + a.ctr, 0) / arr.length,
        position: arr.reduce((s, a) => s + a.position, 0) / arr.length,
      };
    };

    const recent = avg(recentSnaps);
    const previous = avg(previousSnaps);

    const clicksChange = previous.clicks > 0
      ? ((recent.clicks - previous.clicks) / previous.clicks) * 100
      : 0;
    const impressionsChange = previous.impressions > 0
      ? ((recent.impressions - previous.impressions) / previous.impressions) * 100
      : 0;
    const positionChange = recent.position - previous.position;
    const ctrChange = recent.ctr - previous.ctr;

    // Calculate decay score
    const clicksScore = Math.min(100, Math.max(0, -clicksChange));
    const impressionsScore = Math.min(100, Math.max(0, -impressionsChange));
    const positionScore = Math.min(100, Math.max(0, positionChange * 10));
    const ctrScore = Math.min(100, Math.max(0, -ctrChange * 100));
    const decayScore = Math.round(
      clicksScore * 0.4 + impressionsScore * 0.3 + positionScore * 0.2 + ctrScore * 0.1
    );

    if (decayScore > 15) {
      let severity = "low";
      if (decayScore >= 70) severity = "critical";
      else if (decayScore >= 50) severity = "high";
      else if (decayScore >= 30) severity = "medium";

      results.push({
        pageId: page.id,
        url: page.url,
        decayScore,
        clicksChange: Math.round(clicksChange),
        impressionsChange: Math.round(impressionsChange),
        positionChange: Math.round(positionChange * 10) / 10,
        ctrChange: Math.round(ctrChange * 10000) / 100,
        severity,
        recentClicks: Math.round(recent.clicks),
        previousClicks: Math.round(previous.clicks),
      });
    }
  }

  results.sort((a, b) => b.decayScore - a.decayScore);
  return results;
}

export default function SitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [decayResults, setDecayResults] = useState<DecayResult[]>([]);
  const [insights, setInsights] = useState("");
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    fetchSite();
  }, [id]);

  async function fetchSite() {
    try {
      const res = await fetch(`/api/sites/${id}`);
      const data = await res.json();
      setSite(data.site);

      // Compute decay results from existing snapshot/analysis data
      if (data.site?.pages) {
        const computed = computeDecayFromSnapshots(data.site.pages);
        if (computed.length > 0) {
          setDecayResults(computed);
        }
      }
    } catch {
      console.error("Failed to fetch site");
    } finally {
      setLoading(false);
    }
  }

  async function syncSite() {
    setSyncing(true);
    setSyncError("");
    try {
      const res = await fetch(`/api/sites/${id}/sync`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setDecayResults(data.decayResults || []);
        setInsights(data.insights || "");
        fetchSite();
      } else {
        setSyncError(data.error || "Sync failed");
      }
    } catch {
      setSyncError("Failed to connect. Please try again.");
    } finally {
      setSyncing(false);
    }
  }

  function getSeverityColor(severity: string) {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "high":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      default:
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    }
  }

  function getChangeIcon(change: number) {
    if (change > 5) return <TrendingUp className="h-3.5 w-3.5 text-green-400" />;
    if (change < -5) return <TrendingDown className="h-3.5 w-3.5 text-red-400" />;
    return <Minus className="h-3.5 w-3.5 text-slate-500" />;
  }

  function getChangeColor(change: number, inverse = false) {
    const positive = inverse ? change > 0 : change < 0;
    if (positive) return "text-red-400";
    if ((inverse && change < 0) || (!inverse && change > 0)) return "text-green-400";
    return "text-slate-400";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="text-center py-32">
        <h2 className="text-xl font-semibold text-white">Site not found</h2>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 text-orange-400 hover:text-orange-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {site.displayName || site.siteUrl}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{site.siteUrl}</p>
          </div>
          <div className="flex items-center gap-2">
            {decayResults.length > 0 && (
              <a
                href={`/api/sites/${id}/export`}
                download
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </a>
            )}
            <button
              onClick={syncSite}
              disabled={syncing}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500 disabled:opacity-50"
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {syncing ? "Syncing..." : "Sync & Analyze"}
            </button>
          </div>
        </div>
      </div>

      {syncError && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertTriangle className="inline h-4 w-4 mr-2" />
          {syncError}
        </div>
      )}

      {/* AI Insights */}
      {insights && (
        <div className="mb-8 rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-amber-500/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">AI Insights</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {insights}
          </p>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-400">Total Pages</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {site.pages.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-400">Decaying Pages</p>
          <p className="mt-1 text-2xl font-bold text-red-400">
            {decayResults.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-400">Critical</p>
          <p className="mt-1 text-2xl font-bold text-red-500">
            {decayResults.filter((d) => d.severity === "critical").length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-400">Last Synced</p>
          <p className="mt-1 text-sm font-medium text-white">
            {site.lastSyncedAt
              ? new Date(site.lastSyncedAt).toLocaleString()
              : "Never"}
          </p>
        </div>
      </div>

      {/* Active Alerts */}
      {site.pages.some((p) => p.alerts.length > 0) && (
        <div className="mb-8 space-y-2">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Active Alerts
          </h2>
          {site.pages
            .flatMap((p) =>
              p.alerts.map((a) => ({
                ...a,
                pageUrl: p.url,
                pageTitle: p.title,
              }))
            )
            .sort((a, b) => (a.severity === "critical" ? -1 : b.severity === "critical" ? 1 : 0))
            .slice(0, 6)
            .map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-3 text-sm flex items-start gap-3 ${
                  alert.severity === "critical"
                    ? "border-red-500/30 bg-red-500/10"
                    : "border-yellow-500/30 bg-yellow-500/10"
                }`}
              >
                <AlertTriangle
                  className={`h-4 w-4 mt-0.5 shrink-0 ${
                    alert.severity === "critical" ? "text-red-400" : "text-yellow-400"
                  }`}
                />
                <div>
                  <p className={alert.severity === "critical" ? "text-red-300" : "text-yellow-300"}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {alert.pageTitle || alert.pageUrl.replace(/^https?:\/\/[^/]+/, "")}
                  </p>
                </div>
                <span
                  className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    alert.severity === "critical"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Decay results table */}
      {decayResults.length > 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">
              Content Decay Report
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Pages sorted by decay severity. Click a page for detailed analysis.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-slate-400">
                    Page
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 text-center">
                    Decay Score
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 text-center">
                    Clicks
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 text-center">
                    Impressions
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 text-center">
                    Position
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 text-center">
                    Severity
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400"></th>
                </tr>
              </thead>
              <tbody>
                {decayResults.map((result) => (
                  <tr
                    key={result.pageId}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate text-white">
                        {result.url.replace(/^https?:\/\/[^/]+/, "")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono font-bold text-white">
                        {result.decayScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 ${getChangeColor(
                          result.clicksChange
                        )}`}
                      >
                        {getChangeIcon(result.clicksChange)}
                        {result.clicksChange > 0 ? "+" : ""}
                        {result.clicksChange}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 ${getChangeColor(
                          result.impressionsChange
                        )}`}
                      >
                        {getChangeIcon(result.impressionsChange)}
                        {result.impressionsChange > 0 ? "+" : ""}
                        {result.impressionsChange}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 ${getChangeColor(
                          result.positionChange,
                          true
                        )}`}
                      >
                        {result.positionChange > 0 ? (
                          <ArrowDown className="h-3.5 w-3.5" />
                        ) : result.positionChange < 0 ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <Minus className="h-3.5 w-3.5" />
                        )}
                        {result.positionChange > 0 ? "+" : ""}
                        {result.positionChange}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getSeverityColor(
                          result.severity
                        )}`}
                      >
                        {result.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/site/${id}/page/${result.pageId}`}
                        className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
                      >
                        Analyze
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : site.pages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-16 text-center">
          <RefreshCw className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-4 text-lg font-semibold text-white">
            No data yet
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Click &quot;Sync &amp; Analyze&quot; to pull data from Google Search Console and
            detect content decay.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-4 text-lg font-semibold text-white">
            All content is healthy
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            No significant decay signals detected across your {site.pages.length} tracked
            pages. Keep up the good work.
          </p>
        </div>
      )}
    </div>
  );
}
