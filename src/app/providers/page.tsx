// app/providers/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Provider Education — Open ME/CFS",
  description:
    "Practical guidance for clinicians: diagnosis, differential, orthostatic testing, and symptom-directed management for ME/CFS.",
};

export default function ProvidersPage() {
  return (
    <div className="space-y-8">
      {/* Hero (matches Patient Hub gradient + spacing) */}
      <header className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8">
        <h1 className="text-3xl font-bold">Provider Education</h1>
        <p className="mt-2 text-blue-50 max-w-3xl">
          Practical guidance for clinicians: diagnosis, differential,
          orthostatic testing, and symptom-directed management for ME/CFS.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/providers/quick-start"
            className="cursor-pointer rounded-md bg-white/95 text-blue-900 px-4 py-2 font-semibold hover:scale-[1.02] transition"
          >
            Quick-Start (10 min)
          </Link>

          {/* Download Provider Pack (PDF) */}
          <a
            href="/api/provider-pdf?doc=pack"
            className="cursor-pointer rounded-md border border-white/70 text-white px-4 py-2 hover:bg-white/10 transition"
          >
            Download Provider Pack (PDF)
          </a>
        </div>
      </header>

      {/* Quick cards (same card look/feel as Patient Hub) */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Diagnosis (IOM/NAM 2015)",
            desc: "Core criteria, key questions, and clinical approach to ruling in ME/CFS.",
            href: "/providers/diagnosis",
          },
          {
            title: "Differential & Workup",
            desc: "Baselines, common mimics, and a practical rule-out checklist you can copy/paste.",
            href: "/providers/differential",
          },
          {
            title: "Orthostatic Intolerance",
            desc: "10-minute standing test, interpretation, and first-line management options.",
            href: "/providers/orthostatic-intolerance",
          },
          {
            title: "Management Basics",
            desc: "Pacing/energy envelope, sleep, OI therapies, pain, LDN, and follow-up cadence.",
            href: "/providers/management",
          },
          {
            title: "Quick-Start (10 min)",
            desc: "A concise at-a-glance plan for the first visit, including what not to do.",
            href: "/providers/quick-start",
          },
          {
            title: "Downloads",
            desc: "One-pager, Quick-Start, Workup sheets, and the full Provider Pack (PDF).",
            href: "/providers/downloads",
          },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="cursor-pointer block rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
            <p className="mt-1 text-gray-600 text-sm">{c.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
