export const metadata = {
  title: "Privacy Policy — Open ME/CFS",
  description: "How Open ME/CFS collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="mt-6 text-gray-700">
          We respect your privacy. This policy explains what we collect, how we
          use it, and your choices. By using the Service, you agree to this
          policy.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          1) Information we collect
        </h2>
        <ul className="mt-2 text-gray-700 list-disc list-inside space-y-2">
          <li>
            <strong>Contact form data:</strong> name, email, message (so we can
            respond).
          </li>
          <li>
            <strong>Donation data:</strong> amount, currency, recurrence, and
            receipt email. Stripe processes payments; we do not store full card
            details.
          </li>
          <li>
            <strong>Usage data:</strong> basic analytics (page views, referrers,
            device/browser) to improve the Service.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          2) How we use information
        </h2>
        <ul className="mt-2 text-gray-700 list-disc list-inside space-y-2">
          <li>Respond to inquiries and provide support.</li>
          <li>Process donations and send receipts/confirmations.</li>
          <li>Improve content, features, performance, and security.</li>
          <li>
            Maintain records for accounting, transparency, and fraud prevention.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">3) Sharing</h2>
        <p className="mt-2 text-gray-700">
          We share data with service providers only as needed to run the
          Service:
        </p>
        <ul className="mt-2 text-gray-700 list-disc list-inside space-y-2">
          <li>
            <strong>Stripe</strong> (payments & subscriptions)
          </li>
          <li>
            <strong>Resend</strong> (transactional email)
          </li>
          <li>
            <strong>Hosting/infra</strong> such as Vercel (site hosting), and
            GitHub (code hosting)
          </li>
        </ul>
        <p className="mt-2 text-gray-700">
          We do not sell your personal information. We may disclose information
          if required by law or to protect our rights.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          4) Cookies & analytics
        </h2>
        <p className="mt-2 text-gray-700">
          We may use lightweight analytics (e.g., Plausible or similar) and
          essential cookies to operate the site. You can disable cookies in your
          browser; some features may not work as intended.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          5) Data retention
        </h2>
        <p className="mt-2 text-gray-700">
          We retain information only as long as necessary for the purposes above
          and to meet legal obligations.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          6) Your choices
        </h2>
        <ul className="mt-2 text-gray-700 list-disc list-inside space-y-2">
          <li>
            Contact us to request access, correction, or deletion of your
            personal information.
          </li>
          <li>
            Unsubscribe or opt-out of non-essential communications (if/when
            offered).
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          7) Security
        </h2>
        <p className="mt-2 text-gray-700">
          We take reasonable measures to protect your data; no system can be
          100% secure. Use strong passwords and protect your devices.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          8) Children
        </h2>
        <p className="mt-2 text-gray-700">
          The Service is not intended for children under 13. If you believe a
          child has provided personal information, please contact us and we will
          delete it.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">9) Changes</h2>
        <p className="mt-2 text-gray-700">
          We may update this policy from time to time. We’ll post the new date
          above. Continued use after changes means you accept the revised
          policy.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          10) Contact
        </h2>
        <p className="mt-2 text-gray-700">
          Questions? Email{" "}
          <a
            className="text-blue-600 underline"
            href="mailto:contact@openmecfs.org"
          >
            contact@openmecfs.org
          </a>
          .
        </p>

        <p className="mt-8 text-xs text-gray-500">
          This page is provided for convenience and is not legal advice.
        </p>
      </section>
    </main>
  );
}
