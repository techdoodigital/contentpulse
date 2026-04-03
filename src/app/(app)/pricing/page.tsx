"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    slug: "free",
    price: "$0",
    period: "forever",
    description: "Get started with basic content monitoring.",
    features: [
      "1 site",
      "50 pages tracked",
      "Weekly sync frequency",
      "30-day history",
      "5 AI analyses per month",
      "Basic decay detection",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    name: "Starter",
    slug: "starter",
    price: "$19",
    period: "/month",
    description: "For marketers managing multiple properties.",
    features: [
      "3 sites",
      "500 pages tracked",
      "Daily sync frequency",
      "90-day history",
      "50 AI analyses per month",
      "Email alerts",
      "Priority decay scoring",
      "Exportable reports",
    ],
    cta: "Upgrade to Starter",
    highlighted: false,
  },
  {
    name: "Pro",
    slug: "pro",
    price: "$39",
    period: "/month",
    description: "Full content health monitoring for teams.",
    features: [
      "10 sites",
      "2,000 pages tracked",
      "Daily sync frequency",
      "12-month history",
      "Unlimited AI analyses",
      "Email alerts",
      "Priority decay scoring",
      "Exportable reports",
      "Bulk refresh recommendations",
      "API access",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
];

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/subscription")
      .then((r) => r.json())
      .then((data) => setCurrentPlan(data.plan || "free"))
      .catch(console.error);
  }, []);

  async function handleUpgrade(planSlug: string) {
    if (planSlug === "free" || planSlug === currentPlan) return;

    setLoadingPlan(planSlug);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planSlug }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handleManage() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to open portal");
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white">
          Simple, transparent pricing
        </h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto">
          Start free. Upgrade as your monitoring needs grow. No hidden fees.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = plan.slug === currentPlan;
          const isDowngrade =
            (currentPlan === "pro" && plan.slug !== "pro") ||
            (currentPlan === "starter" && plan.slug === "free");

          return (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 ${
                plan.highlighted
                  ? "border-orange-500/50 bg-gradient-to-b from-orange-500/5 to-transparent ring-1 ring-orange-500/20"
                  : "border-slate-800 bg-slate-900/50"
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-0.5 text-xs font-medium text-orange-400 mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-sm text-slate-400">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{plan.description}</p>

              {isCurrent ? (
                currentPlan !== "free" ? (
                  <button
                    onClick={handleManage}
                    disabled={portalLoading}
                    className="mt-6 w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                  >
                    {portalLoading ? (
                      <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                    ) : (
                      "Manage Subscription"
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-6 w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                )
              ) : isDowngrade ? (
                <button
                  onClick={handleManage}
                  disabled={portalLoading}
                  className="mt-6 w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                >
                  {portalLoading ? (
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  ) : (
                    "Downgrade"
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.slug)}
                  disabled={loadingPlan === plan.slug}
                  className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                    plan.highlighted
                      ? "bg-orange-600 text-white hover:bg-orange-500"
                      : "border border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {loadingPlan === plan.slug ? (
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  ) : (
                    plan.cta
                  )}
                </button>
              )}

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <Check className="h-4 w-4 text-orange-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
