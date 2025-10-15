// src/app/providers/downloads/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Downloads — Open ME/CFS",
  description:
    "Download clinician-facing PDFs: Quick-Start, Diagnosis, Differential & Workup, Orthostatic Intolerance, Management, Referrals, and the One-Pager.",
};

type Item = {
  key: string;
  title: string;
  desc: string;
  href: string;
};

const items: Item[] = [
  //   {
  //     key: "onepager",
  //     title: "One-Pager (Patient/Clinician Handout)",
  //     desc: "Single-page overview. Good for quick reference and patient education.",
  //     href: "/one-pager", // if your app exposes /one-pager; otherwise swap to /api/one-pager
  //   },
  {
    key: "quickstart",
    title: "Quick-Start (10–15 min)",
    desc: "First visit flow, what not to do, pacing, OI screen, baseline tests.",
    href: "/api/provider-pdf?doc=quickStart",
  },
  {
    key: "diagnosis",
    title: "Diagnosis (IOM/NAM 2015)",
    desc: "Criteria summary with clinical notes; no single lab confirms ME/CFS.",
    href: "/api/provider-pdf?doc=diagnosis",
  },
  {
    key: "differential",
    title: "Differential & Workup",
    desc: "Baseline/targeted tests and common mimics to rule out.",
    href: "/api/provider-pdf?doc=differential",
  },
  {
    key: "orthostatic",
    title: "Orthostatic Intolerance",
    desc: "History, office screens, NASA Lean details, conservative and medication options.",
    href: "/api/provider-pdf?doc=orthostatic",
  },
  {
    key: "management",
    title: "Management Basics",
    desc: "PEM prevention, sleep & pain basics, OI measures, deficiencies.",
    href: "/api/provider-pdf?doc=management",
  },
  //   {
  //     key: "referrals",
  //     title: "Referrals (Template)",
  //     desc: "Ready-to-copy referral content for specialty clinics.",
  //     href: "/api/provider-pdf?doc=referrals",
  //   },
  // If you have a combined pack endpoint, uncomment and set the href:
  // {
  //   key: "pack",
  //   title: "Provider Pack (All Sections)",
  //   desc: "Combined PDF with Quick-Start, Diagnosis, Differential, OI, and Management.",
  //   href: "/api/provider-pdf?doc=pack",
  // },
];

export default function DownloadsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#1E88E5] text-white p-6">
        <h1 className="text-2xl font-bold">Downloads</h1>
        <p className="mt-2 text-blue-50 max-w-3xl">
          Clinician-facing PDFs for offline use and sharing. Each download is
          generated from the content on this site to stay consistent.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <article
            key={it.key}
            className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-slate-900">{it.title}</h2>
              <p className="mt-1 text-slate-600 text-sm">{it.desc}</p>
            </div>
            <div className="mt-4">
              <Link
                href={it.href}
                className="inline-flex items-center rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700 transition"
              >
                Download PDF
              </Link>
            </div>
          </article>
        ))}
      </section>

      <p className="text-xs text-slate-500">
        For health professionals. Informational only — not medical advice.
      </p>
    </div>
  );
}
