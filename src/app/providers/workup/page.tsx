import Link from "next/link";
import { provider } from "@/lib/providerContent";

export const metadata = {
  title: "Differential & Workup — Open ME/CFS",
  description:
    "Baseline and targeted tests plus common mimics for ME/CFS differential diagnosis.",
};

function groupTests(tests: string[] = []) {
  const baselineMatch =
    /(cbc|cmp|tsh|free\s*t4|ferritin|iron|b12|folate|vitamin\s*d|crp|esr|hba1c|lipid)/i;
  const baseline = tests.filter((t) => baselineMatch.test(t));
  const targeted = tests.filter((t) => !baselineMatch.test(t));
  return { baseline, targeted };
}

export default function WorkupPage() {
  const diff = provider.differential;
  if (!diff) return null;

  const { baseline, targeted } = groupTests(diff.tests);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <header className="rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#1E88E5] text-white p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {diff.title ?? "Differential & Workup"}
            </h1>
            {diff.intro ? (
              <p className="mt-2 text-blue-50/95 max-w-2xl">{diff.intro}</p>
            ) : null}
          </div>
          <Link
            href="/api/provider-pdf?doc=differential"
            className="cursor-pointer inline-flex items-center rounded-md border border-white/70 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
          >
            Download PDF
          </Link>
        </div>
      </header>

      {/* --- Full-width At the Bedside --- */}
      <aside className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">At the Bedside</h2>
        <ul className="mt-2 space-y-2 text-slate-800">
          <li>
            <span className="font-medium">Validate PEM/OI:</span> ask about
            delayed worsening after modest activity; screen upright symptoms.
          </li>
          <li>
            <span className="font-medium">Do orthostatics:</span> lying→standing
            HR/BP at 0/2/5/10 min; document symptoms.
          </li>
          <li>
            <span className="font-medium">Start low-risk support:</span> pacing
            education; fluids/salt/compression if OI suspected.
          </li>
        </ul>

        <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="text-sm font-semibold text-blue-900">
            What to order first
          </div>
          <p className="mt-2 text-sm text-blue-900/90">
            Begin with a concise panel to exclude common mimics and establish
            baselines. Expand only as history/exam directs.
          </p>
          {baseline.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {baseline.slice(0, 6).map((t, i) => (
                <span
                  key={`chip-${i}`}
                  className="rounded-full border border-blue-300 bg-white px-2.5 py-1 text-xs text-blue-800"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* --- Two-column section --- */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Baseline / Targeted Tests */}
        <article className="h-full flex flex-col rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Baseline / Targeted Tests
          </h2>

          {/* Baseline (Order first visit) */}
          {baseline.length > 0 && (
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase text-slate-500">
                First-visit order set
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-800">
                {baseline.map((t, i) => (
                  <li key={`base-${i}`}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Targeted / As indicated */}
          {targeted.length > 0 && (
            <div className="mt-7">
              <div className="text-xs font-semibold uppercase text-slate-500">
                As indicated by history / exam
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-800">
                {targeted.map((t, i) => (
                  <li key={`tgt-${i}`}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {/* Common Mimics */}
        <article className="h-full flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Common Mimics
          </h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-800">
            {(diff.mimics ?? []).map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>

          {/* “Consider if…” helper */}
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="text-sm font-semibold text-amber-900">
              Consider targeted testing when:
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-amber-900/90 space-y-1">
              <li>
                red flags, atypical course, or focal neuro findings emerge
              </li>
              <li>weight loss, fevers, or inflammatory features are present</li>
              <li>
                sleep-disordered breathing is suspected by history/bed partner
              </li>
              <li>orthostatic symptoms suggest autonomic involvement</li>
            </ul>
          </div>
        </article>
      </section>

      <p className="text-xs text-slate-500">{provider.footer}</p>
    </div>
  );
}
