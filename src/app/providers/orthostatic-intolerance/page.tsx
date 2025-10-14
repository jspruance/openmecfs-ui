import Link from "next/link";
import { provider } from "@/lib/providerContent";

export const metadata = {
  title: "Orthostatic Intolerance — Open ME/CFS",
  description:
    "Screening, NASA Lean (10-minute stand) protocol, and first-line management for orthostatic intolerance in ME/CFS.",
};

export default function OrthostaticPage() {
  const o = provider.orthostatic;
  if (!o) return null;

  // Keep source-of-truth from content, but ensure pyridostigmine is present
  const therapy = Array.from(
    new Set([
      ...(o.therapy ?? []),
      "Pyridostigmine (start low; often 30–60 mg/day divided; titrate as tolerated)",
    ])
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <header className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {o.title ?? "Orthostatic Intolerance"}
            </h1>
            {o.intro ? (
              <p className="mt-2 text-blue-50/95 max-w-2xl">{o.intro}</p>
            ) : null}
          </div>

          <Link
            href="/api/provider-pdf?doc=orthostatic"
            className="cursor-pointer inline-flex items-center rounded-md border border-white/70 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
          >
            Download PDF
          </Link>
        </div>
      </header>

      {/* Horizontal cards */}
      <section className="space-y-6">
        {/* Screen (horizontal) */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            <div className="md:w-72 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">Screen</h2>
              <p className="mt-1 text-sm text-slate-600">
                History cues and quick office checks to surface OI.
              </p>
            </div>

            <div className="grow">
              <ul className="list-disc pl-5 space-y-1.5 text-slate-800">
                {(o.screen ?? []).map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>

              <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="text-sm font-semibold text-blue-900">
                  Quick questions
                </div>
                <ul className="mt-2 list-disc pl-5 text-sm text-blue-900/90 space-y-1">
                  <li>Worse upright, better supine?</li>
                  <li>
                    Palpitations, lightheadedness, presyncope, “head pressure”?
                  </li>
                  <li>Intolerance of heat, showers, or prolonged standing?</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        {/* NASA Lean / 10-minute stand (horizontal) */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            <div className="md:w-72 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                10-Minute Stand (NASA Lean Test)
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Simple in-clinic protocol; stop early for presyncope.
              </p>
            </div>

            <div className="grow">
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                {(o.tenMinuteStand ?? []).map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ol>

              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="text-sm font-semibold text-amber-900">
                  Document
                </div>
                <ul className="mt-2 list-disc pl-5 text-sm text-amber-900/90 space-y-1">
                  <li>HR &amp; BP at 0 / 2 / 5 / 10 minutes</li>
                  <li>
                    Symptoms (dizziness, pressure, brain fog, palpitations)
                  </li>
                  <li>Any need to abort test; safety considerations</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        {/* Management (horizontal) */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            <div className="md:w-72 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                Management
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Start conservative; add meds when needed. Avoid provoking PEM.
              </p>
            </div>

            <div className="grow space-y-5">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">
                  First-line (low risk)
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1.5 text-slate-800">
                  {(o.therapy ?? []).slice(0, 1).map((x, i) => (
                    <li key={`first-${i}`}>{x}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">
                  If insufficient / as appropriate
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1.5 text-slate-800">
                  {therapy.slice(1).map((x, i) => (
                    <li key={`next-${i}`}>{x}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="text-sm font-semibold text-emerald-900">
                  Pro tips
                </div>
                <ul className="mt-2 list-disc pl-5 text-sm text-emerald-900/90 space-y-1">
                  <li>Pair all changes with pacing; monitor for PEM.</li>
                  <li>Compression: waist-high 20–30 mmHg if tolerated.</li>
                  <li>“Start low, go slow”; reassess in 4–6 weeks.</li>
                </ul>
              </div>
            </div>
          </div>
        </article>
      </section>

      <p className="text-xs text-slate-500">{provider.footer}</p>
    </div>
  );
}
