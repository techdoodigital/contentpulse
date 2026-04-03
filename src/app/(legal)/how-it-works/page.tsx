import Link from "next/link";
import {
  Search,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Bell,
  ArrowRight,
  Shield,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "How ContentPulse Works | ContentPulse",
  description:
    "ContentPulse connects to Google Search Console, detects content decay across four signals, and delivers AI-powered recovery recommendations.",
};

export default function HowItWorksPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">How ContentPulse Works</h1>
      <p className="text-slate-400 mb-10 max-w-2xl">
        From sign-in to actionable recovery plans in minutes. Here is exactly
        what happens when you use ContentPulse.
      </p>

      {/* Steps */}
      <div className="space-y-6 mb-12">
        {[
          {
            step: "01",
            icon: Search,
            title: "Sign in with Google",
            description:
              "Click \"Start Free\" and sign in with the Google account that has access to your Search Console properties. ContentPulse requests read-only access to your search performance data.",
            detail:
              "We use the webmasters.readonly scope, meaning ContentPulse can only read your data. It cannot modify your Search Console settings, submit URLs, or make any changes to your sites.",
          },
          {
            step: "02",
            icon: RefreshCw,
            title: "Select and sync your sites",
            description:
              "Choose which Search Console properties to monitor. ContentPulse pulls your page-level performance data including clicks, impressions, average position, and click-through rate.",
            detail:
              "Data is pulled for two periods: a recent window and a historical baseline. This comparison is what powers decay detection.",
          },
          {
            step: "03",
            icon: TrendingDown,
            title: "Decay detection runs automatically",
            description:
              "Our engine compares recent performance against historical baselines across four key signals. Pages showing significant decline are flagged and scored.",
            detail:
              "Each page receives a decay score from 0 (healthy) to 100 (severe). Severity levels (Low, Medium, High, Critical) help you prioritize which pages need attention first.",
          },
          {
            step: "04",
            icon: Sparkles,
            title: "AI generates recovery plans",
            description:
              "For each decaying page, ContentPulse uses AI to analyze the specific decline pattern and generate tailored recommendations for recovery.",
            detail:
              "The AI considers the page URL, its keyword context, the type and magnitude of decline, and generates actionable steps specific to that page.",
          },
          {
            step: "05",
            icon: Bell,
            title: "Monitor and recover",
            description:
              "Track your pages over time to see if updates are working. ContentPulse continues monitoring so you can catch new decay early.",
            detail:
              "Paid plans include automated sync schedules and email alerts so you never miss a decline. Free plans can sync manually at any time.",
          },
        ].map((item) => (
          <div
            key={item.step}
            className="rounded-xl border border-slate-800 bg-slate-900/30 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-sm font-bold text-orange-500">
                {item.step}
              </span>
              <item.icon className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-bold text-white">{item.title}</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              {item.description}
            </p>
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* What signals are tracked */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">
          The Four Signals We Track
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              signal: "Clicks",
              description:
                "How many times users click through to your page from search results. A drop in clicks is the most direct indicator of lost traffic.",
              weight: "Primary signal",
            },
            {
              signal: "Impressions",
              description:
                "How often your page appears in search results. Declining impressions means Google is showing your page to fewer people.",
              weight: "Primary signal",
            },
            {
              signal: "Average Position",
              description:
                "Where your page ranks in search results. Position changes directly impact visibility and click probability.",
              weight: "Secondary signal",
            },
            {
              signal: "Click-Through Rate (CTR)",
              description:
                "The percentage of impressions that result in clicks. A dropping CTR suggests your snippet is less compelling than competitors.",
              weight: "Secondary signal",
            },
          ].map((item) => (
            <div
              key={item.signal}
              className="rounded-lg border border-slate-800 bg-slate-900/30 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">
                  {item.signal}
                </h3>
                <span className="text-[10px] rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">
                  {item.weight}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <ul className="space-y-3">
            {[
              "A Google account with verified Search Console properties.",
              "At least one website verified in Google Search Console.",
              "Enough historical data in GSC (at least a few weeks of search data).",
            ].map((req, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                {req}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 p-3">
            <p className="text-xs text-slate-400">
              <strong className="text-slate-300">
                Don't have Search Console set up?
              </strong>{" "}
              Google provides a free guide to{" "}
              <a
                href="https://support.google.com/webmasters/answer/9008080"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 inline-flex items-center gap-1"
              >
                verify your website in Search Console
                <ExternalLink className="h-3 w-3" />
              </a>
              . Once verified and collecting data, come back and connect it to
              ContentPulse.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-500" />
          Privacy and Security
        </h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <ul className="space-y-2">
            {[
              "Read-only access only. ContentPulse cannot modify your Search Console.",
              "Your data is stored separately and only visible to you.",
              "We never share, sell, or aggregate your data.",
              "You can revoke access at any time from your Google account settings.",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <Shield className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-amber-500/5 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
          Free plan includes 1 site and 50 pages. No credit card required.
        </p>
        <Link
          href="/api/auth/signin"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
        >
          Start Monitoring Free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
