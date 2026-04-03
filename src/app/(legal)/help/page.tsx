import Link from "next/link";
import {
  Search,
  UserCheck,
  Globe,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Shield,
  Mail,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "Help & Setup Guide | ContentPulse",
  description:
    "Learn how to connect Google Search Console, set up your account, and get the most out of ContentPulse content decay monitoring.",
};

export default function HelpPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Help & Setup Guide</h1>
      <p className="text-slate-400 mb-10">
        Everything you need to get started with ContentPulse and connect your
        Google Search Console data.
      </p>

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {[
          { href: "#gsc-setup", label: "Connect Google Search Console", icon: Search },
          { href: "#right-account", label: "Which Google account to use", icon: UserCheck },
          { href: "#wrong-account", label: "Signed in with wrong account", icon: AlertTriangle },
          { href: "#how-decay-works", label: "How decay detection works", icon: Globe },
          { href: "#plans-limits", label: "Plans and usage limits", icon: CheckCircle2 },
          { href: "#contact", label: "Contact support", icon: Mail },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4 text-sm text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <link.icon className="h-4 w-4 text-orange-500 shrink-0" />
            {link.label}
          </a>
        ))}
      </div>

      {/* Section: Connect GSC */}
      <section id="gsc-setup" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
            <Search className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">Connecting Google Search Console</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            ContentPulse uses your Google Search Console data to detect content
            decay. Here is how to connect your account:
          </p>
          <ol className="space-y-3">
            {[
              "Click \"Start Free\" or \"Log in\" on the homepage.",
              "Sign in with the Google account that has access to your Search Console properties.",
              "Grant ContentPulse read-only access to your Search Console data when prompted.",
              "Once signed in, your verified sites will appear on the dashboard.",
              "Select a site to start monitoring. ContentPulse will pull your page performance data automatically.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs font-bold text-orange-500">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <p className="text-xs text-slate-400">
              <strong className="text-slate-300">Note:</strong> ContentPulse
              requests <code className="text-orange-400">webmasters.readonly</code>{" "}
              access only. It cannot modify your Search Console settings, submit
              URLs, or change any site configuration.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Right account */}
      <section id="right-account" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
            <UserCheck className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">Which Google Account Should You Use?</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            You must sign in with the Google account that has access to your
            Search Console properties. This is typically:
          </p>
          <ul className="space-y-2">
            {[
              "The email you used to verify your website in Google Search Console.",
              "A Google account that has been added as a user or owner on the Search Console property.",
              "Your company Google Workspace account, if your organization manages Search Console centrally.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <p className="text-xs text-slate-400">
              <strong className="text-slate-300">Not sure?</strong> Go to{" "}
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 inline-flex items-center gap-1"
              >
                Google Search Console
                <ExternalLink className="h-3 w-3" />
              </a>{" "}
              and check which account shows your sites. Use that same account to
              sign in to ContentPulse.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Wrong account */}
      <section id="wrong-account" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">Signed in With the Wrong Account?</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            If you signed in with a Google account that does not have Search
            Console access, your dashboard will show no sites or empty data.
            Here is how to fix it:
          </p>

          <h3 className="text-sm font-semibold text-white">Option 1: Sign out and use the correct account</h3>
          <ol className="space-y-2 ml-1">
            {[
              "Go to your Account page and click \"Sign Out\".",
              "On the sign-in page, choose the Google account that has Search Console access.",
              "Your sites should now appear on the dashboard.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <h3 className="text-sm font-semibold text-white mt-4">
            Option 2: Add your email to Search Console
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            If you want to keep using your current Google account, ask the
            Search Console property owner (or your developer/agency) to add your
            email as a user:
          </p>
          <ol className="space-y-2 ml-1">
            {[
              "The property owner opens Google Search Console.",
              "Go to Settings > Users and permissions.",
              "Click \"Add user\" and enter your email address.",
              "Set permission level to \"Full\" or \"Restricted\".",
              "Once added, return to ContentPulse and your sites will appear.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Section: How decay detection works */}
      <section id="how-decay-works" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
            <Globe className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">How Decay Detection Works</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            ContentPulse compares your recent page performance against
            historical baselines to detect declining content. Here is what it
            measures:
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                signal: "Clicks",
                description: "Drop in organic clicks over the comparison period.",
              },
              {
                signal: "Impressions",
                description: "Declining visibility in search results.",
              },
              {
                signal: "Average Position",
                description: "Ranking slipping for your target queries.",
              },
              {
                signal: "Click-Through Rate",
                description: "Fewer people clicking when they see your result.",
              },
            ].map((item) => (
              <div
                key={item.signal}
                className="rounded-lg border border-slate-700 bg-slate-800/50 p-3"
              >
                <p className="text-sm font-medium text-white">{item.signal}</p>
                <p className="text-xs text-slate-400 mt-1">{item.description}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Pages showing significant decline across multiple signals are
            flagged and given a decay score from 0 (healthy) to 100 (severe
            decay). Severity levels include:
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-red-500/20 text-red-400 px-3 py-1 text-xs font-medium">
              Critical (80-100)
            </span>
            <span className="rounded-full bg-orange-500/20 text-orange-400 px-3 py-1 text-xs font-medium">
              High (60-79)
            </span>
            <span className="rounded-full bg-yellow-500/20 text-yellow-400 px-3 py-1 text-xs font-medium">
              Medium (40-59)
            </span>
            <span className="rounded-full bg-blue-500/20 text-blue-400 px-3 py-1 text-xs font-medium">
              Low (20-39)
            </span>
          </div>
        </div>
      </section>

      {/* Section: Plans */}
      <section id="plans-limits" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
            <CheckCircle2 className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">Plans and Usage Limits</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 pr-4 text-slate-400 font-medium">Feature</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Starter (Free)</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Pro ($19/mo)</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Advanced ($39/mo)</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[
                  ["Sites", "1", "3", "10"],
                  ["Pages tracked", "50", "500", "2,000"],
                  ["AI analyses/month", "5", "50", "Unlimited"],
                  ["Sync frequency", "Weekly", "Daily", "Daily"],
                  ["History", "30 days", "90 days", "12 months"],
                  ["Email alerts", "No", "Yes", "Yes"],
                  ["Exportable reports", "No", "Yes", "Yes"],
                  ["API access", "No", "No", "Yes"],
                  ["Priority support", "No", "No", "Yes"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-slate-800">
                    <td className="py-2.5 pr-4 text-white font-medium">{row[0]}</td>
                    <td className="py-2.5 px-4 text-center">{row[1]}</td>
                    <td className="py-2.5 px-4 text-center">{row[2]}</td>
                    <td className="py-2.5 px-4 text-center">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-400">
            When you reach a limit, you will see a notification in the app. You
            can upgrade at any time from the{" "}
            <Link href="/pricing" className="text-orange-400 hover:text-orange-300">
              Pricing page
            </Link>{" "}
            or your Account settings. Existing data is always preserved.
          </p>
        </div>
      </section>

      {/* Section: Data privacy */}
      <section className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
            <Shield className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">Data Privacy and Security</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
          <ul className="space-y-2">
            {[
              "ContentPulse only requests read-only access to your Search Console data.",
              "Your data is completely isolated and only accessible to you.",
              "We never share, aggregate, or sell your data to third parties.",
              "You can revoke access at any time from your Google Account permissions page.",
              "All data is deleted if you close your account.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <Shield className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-400">
            For full details, see our{" "}
            <Link href="/privacy" className="text-orange-400 hover:text-orange-300">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-orange-400 hover:text-orange-300">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Section: Contact */}
      <section id="contact" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
            <HelpCircle className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">Need More Help?</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            If you have questions not covered here, you can reach us through:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/support"
              className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-300 hover:border-orange-500/50 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4 text-orange-500" />
              <div>
                <p className="font-medium text-white">Submit a Support Ticket</p>
                <p className="text-xs text-slate-500">
                  Get a response within 24 hours
                </p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-slate-500" />
            </Link>
            <a
              href="mailto:support@doodigital.co"
              className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-300 hover:border-orange-500/50 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4 text-orange-500" />
              <div>
                <p className="font-medium text-white">Email Us</p>
                <p className="text-xs text-slate-500">
                  support@doodigital.co
                </p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-slate-500" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
