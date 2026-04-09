import Link from "next/link";
import {
  TrendingDown,
  AlertTriangle,
  BarChart3,
  Clock,
  Search,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const metadata = {
  title: "What Is Content Decay? | CiteWatch",
  description:
    "Content decay is the gradual decline in a page's search performance. Learn the causes, warning signs, and how to detect and recover decaying content.",
};

export default function WhatIsContentDecayPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">What Is Content Decay?</h1>
      <p className="text-slate-400 mb-10 max-w-2xl">
        Content decay is the gradual loss of organic search performance over
        time. Pages that once ranked well start losing positions, clicks, and
        impressions. Left unchecked, it can silently erase months of SEO work.
      </p>

      {/* Visual explainer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-orange-500" />
          The Decay Pattern
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              phase: "Peak Performance",
              description:
                "Your page ranks well, drives consistent traffic, and earns clicks from search results.",
              color: "text-green-400",
              bg: "bg-green-500/10 border-green-500/20",
            },
            {
              phase: "Gradual Decline",
              description:
                "Rankings slip slightly. Impressions start dropping. CTR decreases as competitors publish fresher content.",
              color: "text-yellow-400",
              bg: "bg-yellow-500/10 border-yellow-500/20",
            },
            {
              phase: "Significant Drop",
              description:
                "The page falls off page one. Traffic drops substantially. Recovery becomes harder the longer you wait.",
              color: "text-red-400",
              bg: "bg-red-500/10 border-red-500/20",
            },
          ].map((item) => (
            <div
              key={item.phase}
              className={`rounded-lg border ${item.bg} p-4`}
            >
              <p className={`text-sm font-semibold ${item.color} mb-1`}>
                {item.phase}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Causes */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
          Common Causes of Content Decay
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: Clock,
              title: "Outdated information",
              description:
                "Statistics, dates, product names, or industry practices change. Search engines prefer fresh, accurate content.",
            },
            {
              icon: Search,
              title: "Shifting search intent",
              description:
                "What users expect when they search a query evolves. Your page may no longer match what people are looking for.",
            },
            {
              icon: BarChart3,
              title: "Stronger competition",
              description:
                "Competitors publish better, more comprehensive content on the same topics, pushing your pages down.",
            },
            {
              icon: AlertTriangle,
              title: "Technical issues",
              description:
                "Broken links, slow load times, mobile usability problems, or lost internal links reduce page authority.",
            },
            {
              icon: TrendingDown,
              title: "Algorithm updates",
              description:
                "Google regularly updates ranking algorithms. Pages that once fit the criteria may no longer meet new standards.",
            },
            {
              icon: XCircle,
              title: "Reduced backlinks",
              description:
                "External sites remove links to your content over time, reducing the authority signals that helped you rank.",
            },
          ].map((cause) => (
            <div
              key={cause.title}
              className="rounded-lg border border-slate-800 bg-slate-900/30 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <cause.icon className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-white">
                  {cause.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cause.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Warning signs */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
          Warning Signs to Watch For
        </h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <ul className="space-y-3">
            {[
              "Organic clicks to a page dropping week-over-week or month-over-month.",
              "Impressions declining even though the page is still indexed.",
              "Average position slipping from page one to page two or beyond.",
              "Click-through rate dropping, suggesting your snippet is less compelling than competitors.",
              "Pages that used to be top performers now generate minimal traffic.",
              "Bounce rate increasing on previously high-engagement pages.",
            ].map((sign, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                {sign}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recovery */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
          How to Recover Decaying Content
        </h2>
        <div className="space-y-3">
          {[
            {
              step: "1",
              title: "Identify the decline",
              description:
                "Compare recent performance against historical data. Look for pages with dropping clicks, impressions, and rankings.",
            },
            {
              step: "2",
              title: "Diagnose the cause",
              description:
                "Determine why the page is declining. Is the content outdated? Has competition increased? Has search intent shifted?",
            },
            {
              step: "3",
              title: "Update and refresh",
              description:
                "Rewrite outdated sections, add new information, improve the structure, and ensure the content matches current search intent.",
            },
            {
              step: "4",
              title: "Monitor recovery",
              description:
                "Track the page after updates to confirm rankings and traffic are recovering. Adjust further if needed.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 rounded-lg border border-slate-800 bg-slate-900/30 p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-sm font-bold text-orange-500">
                {item.step}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How CiteWatch helps */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
          How CiteWatch Automates This
        </h2>
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-b from-orange-500/5 to-transparent p-6">
          <ul className="space-y-3">
            {[
              "Connects to your Google Search Console for real performance data.",
              "Automatically compares recent vs. historical metrics across four signals.",
              "Scores every page from 0 (healthy) to 100 (severe decay).",
              "Prioritizes pages by severity so you know where to focus first.",
              "AI analysis explains why each page is declining and what to do about it.",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/api/auth/signin"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
          >
            Start Monitoring Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
