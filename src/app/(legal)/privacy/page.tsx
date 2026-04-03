export const metadata = {
  title: "Privacy Policy - ContentPulse",
  description: "ContentPulse privacy policy covering data collection, Google Search Console access, and your rights.",
};

export default function PrivacyPage() {
  return (
    <div className="prose prose-invert prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-8">Last updated: March 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">1. Overview</h2>
        <p className="text-slate-300 leading-relaxed">
          ContentPulse ("we", "our", "us") is a content health monitoring tool
          operated by DooDigital. This policy explains how we collect, use, and
          protect your personal information when you use our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          2. Information We Collect
        </h2>
        <p className="text-slate-300 leading-relaxed">
          <strong className="text-white">Account Information:</strong> When you
          sign up via Google OAuth, we receive your name, email address, and
          profile picture from your Google account.
        </p>
        <p className="text-slate-300 leading-relaxed mt-3">
          <strong className="text-white">Google Search Console Data:</strong> With
          your explicit permission, we access read-only page performance data
          (clicks, impressions, average position, CTR) from your Google Search
          Console properties. We do not access crawl errors, sitemaps, or any
          other Search Console features. We never modify anything in your Search
          Console account.
        </p>
        <p className="text-slate-300 leading-relaxed mt-3">
          <strong className="text-white">Usage Data:</strong> We collect basic
          analytics about how you use ContentPulse, including pages visited,
          features used, and interaction patterns.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          3. How We Use Your Data
        </h2>
        <ul className="text-slate-300 space-y-2">
          <li>To provide content decay detection and analysis</li>
          <li>To generate AI-powered recommendations for decaying pages</li>
          <li>To send alerts when significant decay is detected</li>
          <li>To manage your subscription and process payments</li>
          <li>To respond to support requests</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          4. Third-Party Services
        </h2>
        <ul className="text-slate-300 space-y-2">
          <li>
            <strong className="text-white">Google:</strong> OAuth authentication
            and Search Console API access
          </li>
          <li>
            <strong className="text-white">OpenAI:</strong> Page content may be
            sent to OpenAI for AI-powered decay analysis and recommendations.
            OpenAI does not use API data for training.
          </li>
          <li>
            <strong className="text-white">Stripe:</strong> Payment processing.
            We never store credit card details directly.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          5. Data Isolation and Security
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Each user's data is completely isolated. Your Search Console data,
          decay reports, and AI analyses are only accessible to you. We never
          share, aggregate, or use your data for any purpose other than
          providing your reports. All data is encrypted in transit and at rest.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          6. Data Retention
        </h2>
        <p className="text-slate-300 leading-relaxed">
          We retain your performance data according to your plan limits (30
          days to 12 months). You can delete your account at any time, which
          will permanently remove all associated data including sites, snapshots,
          alerts, and analyses.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">7. Your Rights</h2>
        <p className="text-slate-300 leading-relaxed">
          You have the right to access, correct, or delete your personal data.
          You can revoke Google Search Console access at any time through your
          Google Account settings. To delete your account and all associated
          data, contact us at support@doodigital.co.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">8. Contact</h2>
        <p className="text-slate-300 leading-relaxed">
          For privacy-related questions, contact us at{" "}
          <a
            href="mailto:support@doodigital.co"
            className="text-orange-400 hover:text-orange-300"
          >
            support@doodigital.co
          </a>
          .
        </p>
      </section>
    </div>
  );
}
