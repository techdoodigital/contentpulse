"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  CreditCard,
  Calendar,
  Loader2,
  ExternalLink,
  AlertTriangle,
  Bell,
} from "lucide-react";

interface SubscriptionData {
  plan: string;
  sitesUsed: number;
  sitesLimit: number;
  pagesUsed: number;
  pagesLimit: number;
  analysesUsed: number;
  analysesLimit: number;
  stripeCustomerId: string | null;
  currentPeriodEnd: string | null;
}

export default function AccountPage() {
  const { data: session } = useSession();
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState("high");
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/user/subscription").then((r) => r.json()),
      fetch("/api/user/preferences").then((r) => r.json()),
    ])
      .then(([subData, prefsData]) => {
        setSub(subData);
        if (typeof prefsData.emailAlerts === "boolean") {
          setEmailAlerts(prefsData.emailAlerts);
        }
        if (prefsData.alertThreshold) {
          setAlertThreshold(prefsData.alertThreshold);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Account Settings</h1>

      {/* Profile */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-400">Name</p>
            <p className="text-sm text-white mt-0.5">
              {session?.user?.name || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Email</p>
            <p className="text-sm text-white mt-0.5">
              {session?.user?.email || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Member since</p>
            <p className="text-sm text-white mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-white">Subscription</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-700 p-4">
            <p className="text-xs text-slate-400">Current Plan</p>
            <p className="mt-1 text-lg font-semibold text-white capitalize">
              {sub?.plan || "Free"}
            </p>
          </div>
          {sub?.currentPeriodEnd && (
            <div className="rounded-lg border border-slate-700 p-4">
              <p className="text-xs text-slate-400">Next Billing Date</p>
              <p className="mt-1 text-sm text-white">
                {new Date(sub.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Usage */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Usage This Period</h3>
          <UsageBar
            label="Sites"
            used={sub?.sitesUsed || 0}
            limit={sub?.sitesLimit || 1}
          />
          <UsageBar
            label="Pages Tracked"
            used={sub?.pagesUsed || 0}
            limit={sub?.pagesLimit || 50}
          />
          <UsageBar
            label="AI Analyses"
            used={sub?.analysesUsed || 0}
            limit={sub?.analysesLimit || 5}
          />
        </div>

        <div className="mt-6 flex gap-3">
          {sub?.stripeCustomerId ? (
            <button
              onClick={openPortal}
              disabled={portalLoading}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-50"
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Manage Billing
            </button>
          ) : (
            sub?.plan === "free" && (
              <a
                href="/pricing"
                className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
              >
                Upgrade Plan
              </a>
            )
          )}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-white">
            Connected Accounts
          </h2>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-700 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-white">Google Account</p>
            <p className="text-xs text-slate-400">
              {session?.user?.email} - Connected for Search Console access
            </p>
          </div>
          <span className="ml-auto rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
            Connected
          </span>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-white">
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-4">
          {/* Email toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Email Alerts</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Receive email notifications when content decay is detected
              </p>
            </div>
            <button
              onClick={async () => {
                const newVal = !emailAlerts;
                setEmailAlerts(newVal);
                setPrefsSaving(true);
                try {
                  await fetch("/api/user/preferences", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailAlerts: newVal }),
                  });
                  setPrefsSaved(true);
                  setTimeout(() => setPrefsSaved(false), 2000);
                } catch {
                  setEmailAlerts(!newVal);
                } finally {
                  setPrefsSaving(false);
                }
              }}
              disabled={prefsSaving}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                emailAlerts ? "bg-orange-500" : "bg-slate-700"
              }`}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  emailAlerts ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Threshold */}
          {emailAlerts && (
            <div>
              <p className="text-sm text-white mb-2">Alert Threshold</p>
              <p className="text-xs text-slate-400 mb-3">
                Only receive emails for alerts at or above this severity level
              </p>
              <div className="flex gap-2">
                {["low", "medium", "high", "critical"].map((level) => (
                  <button
                    key={level}
                    onClick={async () => {
                      setAlertThreshold(level);
                      setPrefsSaving(true);
                      try {
                        await fetch("/api/user/preferences", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ alertThreshold: level }),
                        });
                        setPrefsSaved(true);
                        setTimeout(() => setPrefsSaved(false), 2000);
                      } catch {
                        // Revert on error
                      } finally {
                        setPrefsSaving(false);
                      }
                    }}
                    disabled={prefsSaving}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                      alertThreshold === level
                        ? level === "critical"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : level === "high"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : level === "medium"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "border border-slate-700 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {prefsSaved && (
            <p className="text-xs text-green-400">Preferences saved.</p>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Deleting your account will permanently remove all your sites, decay
          data, and analysis history. This action cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 space-y-3">
            <p className="text-sm text-red-300 font-medium">
              Are you sure? Type <code className="bg-red-500/20 px-1.5 py-0.5 rounded text-xs">DELETE</code> to confirm.
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full rounded-lg border border-red-500/30 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (deleteInput !== "DELETE") return;
                  setDeleting(true);
                  try {
                    const res = await fetch("/api/user/delete", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ confirm: "DELETE_MY_ACCOUNT" }),
                    });
                    if (res.ok) {
                      window.location.href = "/";
                    } else {
                      const data = await res.json();
                      alert(data.error || "Failed to delete account");
                    }
                  } catch {
                    alert("Failed to delete account");
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleteInput !== "DELETE" || deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteInput("");
                }}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min(100, (used / limit) * 100);
  const isNearLimit = !isUnlimited && percentage >= 80;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={isNearLimit ? "text-orange-400" : "text-slate-400"}>
          {used} / {isUnlimited ? "Unlimited" : limit}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-1.5 rounded-full bg-slate-800">
          <div
            className={`h-1.5 rounded-full transition-all ${
              isNearLimit ? "bg-orange-500" : "bg-slate-600"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
