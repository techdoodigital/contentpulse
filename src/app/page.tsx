"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  TrendingDown,
  Bell,
  Sparkles,
  BarChart3,
  RefreshCw,
  Shield,
  ArrowRight,
  Check,
  Zap,
  Search,
  Clock,
  ChevronDown,
  Mail,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  PRICING DATA                                                       */
/* ------------------------------------------------------------------ */
const plans = [
  {
    name: "Starter",
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
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    popular: true,
    description: "For marketers managing multiple properties.",
    features: [
      "Everything in Starter, plus:",
      "3 sites",
      "500 pages tracked",
      "Daily sync frequency",
      "90-day history",
      "50 AI analyses per month",
      "Email alerts",
      "Exportable reports",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Advanced",
    price: "$39",
    period: "/month",
    description: "Full content health monitoring for teams.",
    features: [
      "Everything in Pro, plus:",
      "10 sites",
      "2,000 pages tracked",
      "12-month history",
      "Unlimited AI analyses",
      "Bulk refresh recommendations",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ DATA                                                           */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    q: "What is content decay?",
    a: "Content decay is the gradual decline in a page's search performance over time. Pages that once ranked well start losing positions, clicks, and impressions due to outdated information, increased competition, or shifting search intent. Without monitoring, these declines often go unnoticed until traffic has dropped significantly.",
  },
  {
    q: "How does ContentPulse detect decaying content?",
    a: "ContentPulse connects to your Google Search Console data and compares recent performance against historical baselines. It analyzes four signals: clicks, impressions, average position, and click-through rate. Pages showing significant decline across these signals are flagged and scored by severity.",
  },
  {
    q: "Do I need Google Search Console to use this?",
    a: "Yes. ContentPulse pulls performance data directly from Google Search Console. You need to sign in with the Google account that has access to your verified Search Console properties. If your site is not yet verified in GSC, you will need to set that up first.",
  },
  {
    q: "Which Google account should I use to sign in?",
    a: "Sign in with the Google account that owns or has access to your Search Console properties. This is typically the same email you used to verify your website in Google Search Console. If your developer or agency manages GSC, ask them to add your email as a user on the property.",
  },
  {
    q: "How is this different from checking Google Search Console manually?",
    a: "GSC shows raw data but requires manual comparison of date ranges and page-by-page analysis. ContentPulse automates detection, scores severity so you know where to focus, and provides AI-generated recommendations for how to recover each decaying page.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription at any time from the billing portal. Cancellation takes effect at the end of your current billing period, and your account reverts to the Free plan. No questions asked.",
  },
  {
    q: "Is my data private and secure?",
    a: "Absolutely. Each user's data is completely isolated. Your Search Console data, decay reports, and AI analyses are only accessible to you. We never share, aggregate, or use your data for any purpose other than providing your reports.",
  },
  {
    q: "What happens when I hit my plan limit?",
    a: "You will see a notification that you have reached your limit for sites, pages, or AI analyses. You can upgrade to a higher plan at any time to increase your limits. Your existing data is always preserved.",
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ============================================================ */}
      {/*  STICKY NAVBAR                                                */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold">
              Content<span className="text-orange-500">Pulse</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#benefits" className="text-sm text-slate-400 hover:text-white transition-colors">
              Benefits
            </a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-slate-400 hover:text-white transition-colors">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/api/auth/signin"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/api/auth/signin"
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/*  HERO AREA                                                    */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          {/* Social proof pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-1.5 text-sm text-slate-300 mb-8">
            <Activity className="h-4 w-4 text-orange-500" />
            Content health monitoring powered by Google Search Console
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your content is losing rankings.{" "}
            <span className="text-orange-500">You just don't know it yet.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            ContentPulse connects to Google Search Console, detects pages losing
            traffic and rankings, and gives you AI-powered recommendations to
            recover before your competitors take over.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/api/auth/signin"
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
            >
              Start Monitoring Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              See How It Works
            </a>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Free plan available. No credit card required.
          </p>

          {/* Product preview placeholder */}
          <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900/50 p-2 shadow-2xl shadow-orange-500/5">
            <div className="rounded-lg bg-slate-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-500">
                  contentpulse.app/dashboard
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="rounded-lg border border-slate-700 p-3">
                  <p className="text-[10px] text-slate-500">Total Pages</p>
                  <p className="text-lg font-bold text-white">247</p>
                </div>
                <div className="rounded-lg border border-slate-700 p-3">
                  <p className="text-[10px] text-slate-500">Decaying</p>
                  <p className="text-lg font-bold text-orange-400">18</p>
                </div>
                <div className="rounded-lg border border-slate-700 p-3">
                  <p className="text-[10px] text-slate-500">Critical</p>
                  <p className="text-lg font-bold text-red-400">4</p>
                </div>
                <div className="rounded-lg border border-slate-700 p-3">
                  <p className="text-[10px] text-slate-500">Recovered</p>
                  <p className="text-lg font-bold text-green-400">12</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { url: "/blog/seo-strategies-2025", score: 89, severity: "Critical", change: "-78%" },
                  { url: "/services/web-design", score: 72, severity: "High", change: "-45%" },
                  { url: "/blog/ai-marketing-tools", score: 38, severity: "Medium", change: "-22%" },
                ].map((row) => (
                  <div key={row.url} className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2">
                    <span className="text-xs text-slate-300 truncate max-w-[40%]">{row.url}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-red-400">{row.change} clicks</span>
                      <span className="text-xs font-bold text-white">{row.score}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        row.severity === "Critical" ? "bg-red-500/20 text-red-400" :
                        row.severity === "High" ? "bg-orange-500/20 text-orange-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {row.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PARTNERS / TRUST BAR                                         */}
      {/* ============================================================ */}
      <section className="border-y border-slate-800/50 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs text-slate-500 mb-6">
            Built for content teams, SEO professionals, and digital marketers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {["Content Teams", "SEO Agencies", "SaaS Marketers", "E-commerce Brands", "Media Publishers", "Freelance Writers"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-800 bg-slate-900/50 px-4 py-1.5 text-xs text-slate-400"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BENEFITS (BENTO GRID)                                        */}
      {/* ============================================================ */}
      <section id="benefits" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold">
            Stop losing traffic you worked hard to earn
          </h2>
          <p className="mt-3 text-center text-slate-400 max-w-2xl mx-auto">
            ContentPulse watches your pages 24/7 so you can focus on creating,
            not constantly checking dashboards.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: TrendingDown,
                title: "Catch drops before they become crises",
                description:
                  "Multi-signal analysis detects declining pages early, before small dips compound into major traffic losses.",
              },
              {
                icon: Sparkles,
                title: "AI tells you exactly what went wrong",
                description:
                  "Not generic advice. Each decaying page gets specific, actionable recommendations tailored to its unique decline pattern.",
              },
              {
                icon: RefreshCw,
                title: "Automated monitoring, zero manual work",
                description:
                  "Set it and forget it. ContentPulse syncs with Search Console automatically and alerts you when pages need attention.",
              },
              {
                icon: Bell,
                title: "Prioritized alerts for what matters most",
                description:
                  "Every page gets a decay score (0-100) with severity ratings. You always know which pages to fix first.",
              },
              {
                icon: Clock,
                title: "Track recovery over time",
                description:
                  "See whether your updates are working. Historical data shows if pages are recovering or continuing to decline.",
              },
              {
                icon: Shield,
                title: "Your data stays private, always",
                description:
                  "Per-user data isolation. Your Search Console data is never shared, aggregated, or used beyond your own analysis.",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 hover:border-slate-700 transition-colors"
              >
                <benefit.icon className="h-6 w-6 text-orange-500 mb-3" />
                <h3 className="text-base font-semibold text-white">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                 */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-20 border-t border-slate-800/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold">How it works</h2>
          <p className="mt-3 text-center text-slate-400">
            Get started in 3 simple steps.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Search,
                title: "Connect Google Search Console",
                description:
                  "One-click Google sign-in. ContentPulse pulls your page performance data automatically using read-only access.",
              },
              {
                step: "02",
                icon: TrendingDown,
                title: "We detect content decay",
                description:
                  "Our engine compares recent vs. historical performance across clicks, impressions, position, and CTR to surface declining pages.",
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Get AI recovery plans",
                description:
                  "For each decaying page, get specific recommendations: what to update, why it declined, and how to recover rankings.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-slate-800 bg-slate-900/30 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-sm font-bold text-orange-500">
                    {item.step}
                  </span>
                  <item.icon className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* GSC requirement note */}
          <div className="mt-8 mx-auto max-w-2xl rounded-lg border border-slate-800 bg-slate-900/30 p-4 text-center">
            <p className="text-sm text-slate-400">
              <strong className="text-slate-300">Important:</strong> You need a
              Google account with verified Search Console properties. Sign in
              with the same email you use to manage your sites in GSC.{" "}
              <Link href="/help" className="text-orange-400 hover:text-orange-300 underline">
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRICING                                                      */}
      {/* ============================================================ */}
      <section id="pricing" className="py-20 border-t border-slate-800/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold">
            Simple pricing that scales with you
          </h2>
          <p className="mt-3 text-center text-slate-400 max-w-xl mx-auto">
            Start free. Upgrade when you need more sites, pages, or AI analyses.
            No hidden fees.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => (
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
                <p className="mt-2 text-sm text-slate-400">
                  {plan.description}
                </p>

                <Link
                  href="/api/auth/signin"
                  className={`mt-6 flex items-center justify-center w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-orange-600 text-white hover:bg-orange-500"
                      : "border border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {plan.cta}
                </Link>

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
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ                                                          */}
      {/* ============================================================ */}
      <section id="faq" className="py-20 border-t border-slate-800/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA BANNER                                                   */}
      {/* ============================================================ */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 via-orange-500/10 to-amber-500/20 border border-orange-500/20 p-8 sm:p-12 text-center">
            <Zap className="mx-auto h-10 w-10 text-orange-500 mb-4" />
            <h2 className="text-3xl font-bold">
              Stop letting content decay cost you traffic
            </h2>
            <p className="mt-3 text-slate-400 max-w-lg mx-auto">
              Free plan includes 1 site and 50 pages. No credit card required.
              Set up in under 2 minutes.
            </p>
            <Link
              href="/api/auth/signin"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
            >
              Start Monitoring Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="border-t border-slate-800/50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-semibold">
                  Content<span className="text-orange-500">Pulse</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Content health monitoring tool by DooDigital. Detect content
                decay, get AI-powered recovery plans, and protect your search
                traffic.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#how-it-works" className="text-xs text-slate-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-xs text-slate-400 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/what-is-content-decay" className="text-xs text-slate-400 hover:text-white transition-colors">
                    What Is Content Decay?
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Detailed Guide
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Help & Setup
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Stay Updated
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Get content decay tips and product updates.
              </p>
              <NewsletterForm />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} DooDigital. All rights reserved.
            </p>
            <p className="text-xs text-slate-600">
              Part of the DooDigital suite. Built for marketers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ ACCORDION ITEM                                                 */
/* ------------------------------------------------------------------ */
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-xs text-green-400">{message}</p>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          placeholder="your@email.com"
          required
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-orange-600 p-1.5 text-white hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          <Mail className="h-4 w-4" />
        </button>
      </form>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-1">{message}</p>
      )}
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="text-sm font-semibold text-white pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-sm text-slate-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
