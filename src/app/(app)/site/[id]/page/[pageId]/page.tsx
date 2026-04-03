"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
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

interface AnalysisData {
  id: string;
  decayScore: number;
  summary: string;
  recommendations: string[];
  createdAt: string;
}

interface PageData {
  id: string;
  url: string;
  title: string | null;
  siteId: string;
  snapshots: Snapshot[];
  alerts: Alert[];
  analyses: AnalysisData[];
}

export default function PageDetailPage({
  params,
}: {
  params: Promise<{ id: string; pageId: string }>;
}) {
  const { id, pageId } = use(params);
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  async function fetchPage() {
    try {
      // Fetch from the site endpoint and find our page
      const res = await fetch(`/api/sites/${id}`);
      const data = await res.json();
      if (data.site) {
        const found = data.site.pages.find(
          (p: PageData) => p.id === pageId
        );
        if (found) {
          setPage(found);
          // Check for existing analyses
          if (found.analyses && found.analyses.length > 0) {
            const latest = found.analyses[0];
            setAnalysis({
              ...latest,
              recommendations:
                typeof latest.recommendations === "string"
                  ? JSON.parse(latest.recommendations)
                  : latest.recommendations,
            });
          }
        }
      }
    } catch {
      console.error("Failed to fetch page");
    } finally {
      setLoading(false);
    }
  }

  async function runAnalysis() {
    setAnalyzing(true);
    setError("");
    try {
      const res = await fetch(`/api/pages/${pageId}/analyze`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch {
      setError("Failed to run analysis. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-32">
        <h2 className="text-xl font-semibold text-white">Page not found</h2>
        <Link
          href={`/site/${id}`}
          className="mt-4 inline-flex items-center gap-2 text-orange-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    );
  }

  // Calculate basic stats from snapshots
  const sortedSnapshots = [...page.snapshots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const latest = sortedSnapshots[sortedSnapshots.length - 1];
  const earliest = sortedSnapshots[0];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/site/${id}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Site
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white break-all">
              {page.url.replace(/^https?:\/\/[^/]+/, "")}
            </h1>
            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-orange-400"
            >
              {page.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-50"
          >
            {analyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {analyzing ? "Analyzing..." : "Run AI Analysis"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertTriangle className="inline h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {/* Performance overview */}
      {latest && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Clicks (latest)</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {latest.clicks}
            </p>
            {earliest && earliest.date !== latest.date && (
              <p className="mt-1 text-xs text-slate-500">
                was {earliest.clicks}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Impressions (latest)</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {latest.impressions}
            </p>
            {earliest && earliest.date !== latest.date && (
              <p className="mt-1 text-xs text-slate-500">
                was {earliest.impressions}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Avg Position (latest)</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {latest.position.toFixed(1)}
            </p>
            {earliest && earliest.date !== latest.date && (
              <p className="mt-1 text-xs text-slate-500">
                was {earliest.position.toFixed(1)}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">CTR (latest)</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {(latest.ctr * 100).toFixed(1)}%
            </p>
            {earliest && earliest.date !== latest.date && (
              <p className="mt-1 text-xs text-slate-500">
                was {(earliest.ctr * 100).toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      )}

      {/* Alerts */}
      {page.alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            Active Alerts
          </h2>
          <div className="space-y-2">
            {page.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 text-sm ${
                  alert.severity === "critical"
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : alert.severity === "high"
                    ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
                    : "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                }`}
              >
                <AlertTriangle className="inline h-4 w-4 mr-2" />
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Snapshot history */}
      {sortedSnapshots.length > 0 && (
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">
              Performance History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-slate-400">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 text-right">
                    Clicks
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 text-right">
                    Impressions
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 text-right">
                    Position
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 text-right">
                    CTR
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...sortedSnapshots].reverse().map((snap) => (
                  <tr
                    key={snap.id}
                    className="border-b border-slate-800/50"
                  >
                    <td className="px-4 py-3 text-slate-300">{snap.date}</td>
                    <td className="px-4 py-3 text-right text-white">
                      {snap.clicks}
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      {snap.impressions}
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      {snap.position.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      {(snap.ctr * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Analysis */}
      {analysis ? (
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">AI Analysis</h2>
            <span className="text-xs text-slate-500 ml-auto">
              {new Date(analysis.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-300 mb-2">
              Summary
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">
              Recommendations
            </h3>
            <div className="space-y-2">
              {analysis.recommendations.map(
                (rec: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-800/30 p-3"
                  >
                    <CheckCircle className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-300">{rec}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-slate-600" />
          <h3 className="mt-4 text-lg font-semibold text-white">
            No analysis yet
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Click &quot;Run AI Analysis&quot; to get actionable recommendations for
            refreshing this content.
          </p>
        </div>
      )}
    </div>
  );
}
