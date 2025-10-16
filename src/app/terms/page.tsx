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

        <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800 font-semibold">
            ⚠️ IMPORTANT: BY USING THIS WEBSITE, YOU AGREE TO THESE TERMS
          </p>
          <p className="mt-2 text-red-700 text-sm">
            Welcome to <strong>Open ME/CFS</strong> (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;). By using our website and services (the &quot;Service&quot;), 
            you acknowledge that you have read, understood, and agree to be bound by these Terms. 
            <strong>If you do not agree to these Terms, you must not use this Service.</strong>
          </p>
        </div>

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
          2) Not medical advice - IMPORTANT DISCLAIMERS
        </h2>
        <p className="mt-2 text-gray-700">
          <strong>By using this website, you acknowledge and agree that:</strong>
        </p>
        <ul className="mt-3 text-gray-700 list-disc list-inside space-y-2">
          <li>
            <strong>No Medical Advice:</strong> All content is for informational and educational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment.
          </li>
          <li>
            <strong>Consult Your Doctor:</strong> You will consult with a qualified healthcare provider before implementing any treatment protocol, medication, or medical approach described on this site.
          </li>
          <li>
            <strong>No Guarantees:</strong> We make no claims about the effectiveness, safety, or appropriateness of any treatments, medications, or approaches mentioned.
          </li>
          <li>
            <strong>Individual Variation:</strong> Medical conditions and responses vary greatly between individuals. What works for one person may not work for another.
          </li>
          <li>
            <strong>Emergency Situations:</strong> This site is not for medical emergencies. Seek immediate professional medical care for urgent health concerns.
          </li>
        </ul>

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
          4) User Responsibilities and Acceptable Use
        </h2>
        <p className="mt-2 text-gray-700">
          <strong>You agree to:</strong>
        </p>
        <ul className="mt-3 text-gray-700 list-disc list-inside space-y-2">
          <li>
            <strong>Consult Healthcare Providers:</strong> Always consult with qualified healthcare providers before making any medical decisions based on information from this site.
          </li>
          <li>
            <strong>Use Information Responsibly:</strong> Use information from this site responsibly and in conjunction with professional medical advice.
          </li>
          <li>
            <strong>Not Misuse the Service:</strong> Do not misuse the Service, attempt to compromise security, scrape at scale, or infringe on others&apos; rights.
          </li>
          <li>
            <strong>Report Issues:</strong> Report any errors, inaccuracies, or concerns about content to us promptly.
          </li>
        </ul>
        <p className="mt-3 text-gray-700">
          We may suspend or restrict access for abuse or violations of these Terms.
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
          6) LIMITATION OF LIABILITY - IMPORTANT LEGAL PROTECTION
        </h2>
        <p className="mt-2 text-gray-700">
          <strong>By using this website, you agree to the following limitations:</strong>
        </p>
        <ul className="mt-3 text-gray-700 list-disc list-inside space-y-2">
          <li>
            <strong>No Liability for Medical Decisions:</strong> We are not liable for any damages, injuries, or adverse outcomes resulting from your use of information on this site, including but not limited to medical decisions, treatment choices, or health outcomes.
          </li>
          <li>
            <strong>No Liability for Third-Party Content:</strong> We are not responsible for the accuracy, completeness, or safety of any third-party information, research, or recommendations referenced on this site.
          </li>
          <li>
            <strong>No Liability for Provider Directory:</strong> We do not endorse, guarantee, or assume responsibility for any healthcare providers listed in our directory. You use such information at your own risk.
          </li>
          <li>
            <strong>No Liability for Treatment Outcomes:</strong> We are not liable for any negative outcomes, side effects, or complications from treatments, medications, or approaches mentioned on this site.
          </li>
          <li>
            <strong>User Responsibility:</strong> You are solely responsible for your health decisions and must consult qualified healthcare providers before making any medical choices.
          </li>
          <li>
            <strong>Maximum Liability:</strong> Our total liability, if any, shall not exceed the amount you paid to use this service (which is currently $0).
          </li>
        </ul>
        <p className="mt-3 text-gray-700">
          The Service is provided &quot;AS IS&quot; without warranties of any kind. To the fullest extent permitted by law, we disclaim all warranties and are not liable for any indirect, incidental, consequential, or punitive damages.
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
