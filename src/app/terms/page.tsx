export const metadata = {
  title: "Terms of Use — Open ME/CFS",
  description: "Terms for using the Open ME/CFS website and services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="mt-6 text-gray-700">
          Welcome to <strong>Open ME/CFS</strong> (“we,” “us,” “our”). By using
          our website and services (the “Service”), you agree to these Terms. If
          you do not agree, please do not use the Service.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          1) Who we are
        </h2>
        <p className="mt-2 text-gray-700">
          Open ME/CFS is a community project that curates and summarizes
          publicly available ME/CFS research and provides tools to explore it.
          We are not a healthcare provider and do not offer medical advice.
          {/* TODO: Update to reference "XJS Industries, LLC d/b/a Open ME/CFS" after LLC filing */}
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          2) Not medical advice
        </h2>
        <p className="mt-2 text-gray-700">
          Content is for informational and educational purposes only and is not
          a substitute for professional medical advice, diagnosis, or treatment.
          Always seek the advice of a qualified health provider regarding a
          medical condition.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          3) Donations
        </h2>
        <ul className="mt-2 text-gray-700 list-disc list-inside space-y-2">
          <li>
            Donations are processed by Stripe. We do not store full payment card
            details on our servers.
          </li>
          <li>
            Donations support the Open ME/CFS project. We may grant a portion to
            independent ME/CFS efforts.
          </li>
          <li>
            Donations are <strong>not tax-deductible</strong>. We are not a
            tax-exempt charity.
          </li>
          <li>
            <strong>Refunds:</strong> Donations are generally non-refundable. If
            you believe a charge was made in error, contact us at{" "}
            <a
              className="text-blue-600 underline"
              href="mailto:contact@openmecfs.org"
            >
              contact@openmecfs.org
            </a>{" "}
            within 7 days.
          </li>
          <li>
            <strong>Monthly donations:</strong> You may cancel any time by
            emailing{" "}
            <a
              className="text-blue-600 underline"
              href="mailto:contact@openmecfs.org"
            >
              contact@openmecfs.org
            </a>
            . (Self-service portal coming soon.)
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          4) Acceptable use
        </h2>
        <p className="mt-2 text-gray-700">
          Do not misuse the Service, attempt to compromise security, scrape at
          scale, or infringe on others’ rights. We may suspend or restrict
          access for abuse or violations of these Terms.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          5) Intellectual property
        </h2>
        <p className="mt-2 text-gray-700">
          The Service’s design, code, and compiled datasets are owned by Open
          ME/CFS or licensed to us. Third-party trademarks and content remain
          the property of their respective owners. Research abstracts and
          citations belong to their original publishers.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">
          6) “AS IS” service; limitation of liability
        </h2>
        <p className="mt-2 text-gray-700">
          The Service is provided “AS IS” without warranties of any kind. To the
          fullest extent permitted by law, we are not liable for any indirect,
          incidental, consequential, or punitive damages arising out of your
          use.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">7) Changes</h2>
        <p className="mt-2 text-gray-700">
          We may update these Terms from time to time. We’ll post the new date
          above. Continued use of the Service after changes means you accept the
          revised Terms.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">8) Contact</h2>
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
