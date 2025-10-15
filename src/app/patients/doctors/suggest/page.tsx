// app/patients/doctors/suggest/page.tsx
import Link from "next/link";
import SuggestClinicForm from "./SuggestClinicForm";

export const metadata = {
  title: "Suggest a Clinic — Open ME/CFS",
  description: "Recommend an ME/CFS or OI/autonomic clinic for the directory.",
};

export default function SuggestClinicPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Suggest a Clinic</h1>
          <p className="text-gray-600 mt-2">
            Know an ME/CFS-aware clinician or an OI/autonomic clinic? Share the
            details below. We’ll review submissions before listing.
          </p>
          <div className="mt-3">
            <Link
              href="/patients/doctors/directory"
              className="text-blue-700 hover:underline"
            >
              ← Back to Directory
            </Link>
          </div>
        </header>

        <div className="rounded-xl border border-gray-200 p-5 bg-white">
          <SuggestClinicForm />
          <p className="mt-3 text-xs text-gray-500">
            Submissions are reviewed for accuracy and availability. This is
            informational, not medical advice.
          </p>
        </div>
      </section>
    </main>
  );
}
