import Link from "next/link";
import { provider } from "@/lib/providerContent";

export const metadata = {
  title: "Management Basics — Open ME/CFS",
  description:
    "Symptom-directed ME/CFS care focused on preventing PEM, optimizing sleep and pain control, and stepwise OI management.",
};

export default function ManagementPage() {
  const m = provider.management;
  if (!m) return null;

  const pacing = m.pacing ?? [];
  const sleep = m.sleep ?? [];
  const pain = m.pain ?? [];
  const meds = m.meds ?? [];
  const supplements = m.supplements ?? [];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <header className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {m.title ?? "Management Basics"}
            </h1>
            {m.intro ? (
              <p className="mt-2 text-blue-50/95 max-w-2xl">{m.intro}</p>
            ) : null}
          </div>

          <Link
            href="/api/provider-pdf?doc=management"
            className="cursor-pointer inline-flex items-center rounded-md border border-white/70 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
          >
            Download PDF
          </Link>
        </div>
      </header>

      {/* Horizontal cards */}
      <section className="space-y-6">
        {/* Pacing / PEM prevention */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            <div className="md:w-72 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                Pacing & PEM Prevention
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Core strategy: activities should not provoke Post-Exertional
                Malaise.
              </p>
            </div>
            <div className="grow">
              <ul className="list-disc pl-5 space-y-1.5 text-slate-800">
                {pacing.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="text-sm font-semibold text-amber-900">
                  Crash plan
                </div>
                <ul className="mt-2 list-disc pl-5 text-sm text-amber-900/90 space-y-1">
                  <li>
                    Early rest at first warning signs; avoid “pushing through”.
                  </li>
                  <li>
                    Reduce upright time and cognitive load; prioritize recovery.
                  </li>
                  <li>
                    Reassess triggers; adjust envelope before resuming baseline.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        {/* Sleep */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            <div className="md:w-72 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                Sleep Optimization
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Aim for restorative sleep before stimulants or sedatives.
              </p>
            </div>
            <div className="grow">
              <ul className="list-disc pl-5 space-y-1.5 text-slate-800">
                {sleep.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* Pain / Headache */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            <div className="md:w-72 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                Pain & Headache
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Multimodal approach; treat migraine where present.
              </p>
            </div>
            <div className="grow">
              <ul className="list-disc pl-5 space-y-1.5 text-slate-800">
                {pain.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* Medications & Supplements */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            <div className="md:w-72 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                Medications & Supplements
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                “Start low, go slow.” Pair med changes with pacing to avoid PEM.
              </p>
            </div>
            <div className="grow grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">
                  Medications
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1.5 text-slate-800">
                  {meds.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">
                  Supplements / Deficiencies
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1.5 text-slate-800">
                  {supplements.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </article>

        {/* Follow-up */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            <div className="md:w-72 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                Follow-Up & Safety
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Reassess regularly; avoid abrupt multi-drug changes.
              </p>
            </div>
            <div className="grow">
              <ul className="list-disc pl-5 space-y-1.5 text-slate-800">
                <li>
                  Review PEM frequency/severity and orthostatic symptoms every
                  4–6 weeks.
                </li>
                <li>
                  Adjust one variable at a time; document response and crashes.
                </li>
                <li>
                  Coordinate accommodations (reduced upright time, remote
                  options, rest breaks).
                </li>
              </ul>
            </div>
          </div>
        </article>
      </section>

      <p className="text-xs text-slate-500">{provider.footer}</p>
    </div>
  );
}
