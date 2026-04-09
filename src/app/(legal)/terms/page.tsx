export const metadata = {
  title: "Terms of Service - CiteWatch",
  description: "CiteWatch terms of service covering usage, subscriptions, and liability.",
};

export default function TermsPage() {
  return (
    <div className="prose prose-invert prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
      <p className="text-sm text-slate-400 mb-8">Last updated: March 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">1. Service Description</h2>
        <p className="text-slate-300 leading-relaxed">
          CiteWatch is a content health monitoring tool that connects to your
          Google Search Console to detect pages experiencing traffic and ranking
          declines. The service provides decay scoring, automated alerts, and
          AI-powered recommendations for content recovery.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">2. Account Requirements</h2>
        <p className="text-slate-300 leading-relaxed">
          To use CiteWatch, you must sign in with a Google account that has
          access to Google Search Console properties. You are responsible for
          maintaining the security of your Google account. CiteWatch
          requires read-only access to your Search Console data and will never
          make modifications to your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">3. Acceptable Use</h2>
        <p className="text-slate-300 leading-relaxed">
          You agree to use CiteWatch only for monitoring websites you own or
          have authorization to monitor. You may not attempt to access other
          users' data, reverse-engineer the service, or use the service for any
          unlawful purpose.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">4. Subscription Plans</h2>
        <p className="text-slate-300 leading-relaxed">
          CiteWatch offers Free, Starter, and Pro subscription tiers. Paid
          subscriptions are billed monthly through Stripe. Plan limits (sites,
          pages, analyses) are enforced automatically. Exceeding plan limits
          requires upgrading to a higher tier.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">5. Cancellation and Refunds</h2>
        <p className="text-slate-300 leading-relaxed">
          You may cancel your subscription at any time through the billing
          portal. Cancellation takes effect at the end of your current billing
          period. We do not offer prorated refunds for partial months. After
          cancellation, your account reverts to the Free plan.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">6. Data Ownership</h2>
        <p className="text-slate-300 leading-relaxed">
          You retain all rights to your data. CiteWatch does not claim
          ownership over your Search Console data, decay reports, or any content
          you provide. We only use your data to operate the service as
          described in our Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">7. AI-Generated Content</h2>
        <p className="text-slate-300 leading-relaxed">
          CiteWatch uses AI models to generate decay analysis and
          recommendations. AI-generated content is provided as guidance only and
          should not be treated as professional SEO advice. We do not guarantee
          the accuracy or effectiveness of AI-generated recommendations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">8. Service Availability</h2>
        <p className="text-slate-300 leading-relaxed">
          We strive for high availability but do not guarantee uninterrupted
          service. CiteWatch depends on third-party services (Google Search
          Console API, OpenAI) that may experience outages. We are not liable
          for service interruptions caused by third-party dependencies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">9. Limitation of Liability</h2>
        <p className="text-slate-300 leading-relaxed">
          CiteWatch is provided "as is" without warranty of any kind. We are
          not liable for any indirect, incidental, or consequential damages
          arising from your use of the service, including but not limited to
          lost traffic, lost revenue, or data loss.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white">10. Contact</h2>
        <p className="text-slate-300 leading-relaxed">
          For questions about these terms, contact us at{" "}
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
