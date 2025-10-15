// src/app/providers/diagnosis/page.tsx
import Link from "next/link";
import { provider } from "@/lib/providerContent";
import {
  FileDown,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "Diagnosis (IOM/NAM 2015) — Open ME/CFS",
  description:
    "Clinician guide to diagnosing ME/CFS using IOM/NAM 2015 criteria: core features, practical assessment steps, pitfalls to avoid, ICD-10-CM code, and documentation tips.",
};

export default function DiagnosisPage() {
  const d = provider.diagnosis;
  if (!d) return null;

  const bullets = d.criteria ?? [];
  const notes = d.notes ?? [];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <header className="rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#1E88E5] text-white p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{d.title ?? "Diagnosis"}</h1>
            <p className="mt-2 text-blue-50 max-w-3xl">
              The <span className="font-semibold">IOM/NAM 2015</span> criteria
              are the current clinical standard for diagnosing Myalgic
              Encephalomyelitis/Chronic Fatigue Syndrome (ME/CFS). Diagnosis is
              based on history and exam consistent with the criteria{" "}
              <em>and</em> exclusion of common mimics.{" "}
              <span className="underline decoration-blue-200/60">
                There is no single laboratory test
              </span>{" "}
              that confirms ME/CFS; it is a clinical diagnosis anchored in
              established features.
            </p>
          </div>
          <Link
            href="/api/provider-pdf?doc=diagnosis"
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-white/95 text-blue-900 px-4 py-2 font-semibold hover:scale-[1.02] transition shadow-sm"
          >
            <FileDown className="h-4 w-4" />
            Download PDF
          </Link>
        </div>
      </header>

      {/* Criteria Card */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Core Diagnostic Criteria (IOM/NAM 2015)
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        <div className="mt-5 rounded-lg bg-blue-50 border border-blue-100 p-4 text-blue-900">
          <p className="font-medium">Clinical assessment, not a single test.</p>
          <p className="mt-1 text-sm">
            Use history, exam, and targeted workup to exclude common mimics
            (e.g., anemia, thyroid disease, primary sleep disorders). Document
            post-exertional symptom worsening (PEM) and consider orthostatic
            intolerance (OI) with simple lying→standing vitals.
          </p>
        </div>
      </section>

      {/* Practical Assessment */}
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Stethoscope className="h-5 w-5 text-violet-600" />
            Practical Assessment Flow (10–15 min)
          </h3>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-slate-700">
            <li>
              <span className="font-medium">History.</span> Ask about activity
              reduction (&gt;6 months), PEM (delayed 24–48 h crash after small
              efforts), unrefreshing sleep, and cognitive or upright symptoms.
            </li>
            <li>
              <span className="font-medium">Screen for OI.</span> Lying→standing
              HR/BP at 0/2/5/10 min and symptom capture; note
              heat/shower/standing intolerance.
            </li>
            <li>
              <span className="font-medium">Targeted rule-outs.</span> Order
              focused labs per Workup page (CBC, CMP, TSH, ferritin/iron
              studies, B12, vit D, CRP/ESR; plus context-driven tests).
            </li>
            <li>
              <span className="font-medium">Document.</span> Use concise
              language (see below) and schedule safe follow-up. Avoid changes
              that may provoke PEM.
            </li>
          </ol>
        </article>

        {/* Pitfalls / What not to do */}
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Common Pitfalls to Avoid
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
            <li>
              Presenting CBT or fixed-increment graded exercise as
              disease-modifying. Both can worsen PEM; frame CBT only as optional
              coping support.
            </li>
            <li>
              Dismissing symptoms as purely psychological when PEM/OI features
              are present.
            </li>
            <li>
              Large medication changes during an acute crash—prefer “start low,
              go slow”.
            </li>
          </ul>
        </article>
      </section>

      {/* Diagnosis Code */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
          <FileText className="h-5 w-5 text-indigo-600" />
          Diagnosis Code
        </h2>
        <div className="mt-3 space-y-2 text-slate-700">
          <p>
            <span className="font-medium text-slate-900">ICD-10-CM Code:</span>{" "}
            <code className="bg-slate-100 rounded px-2 py-1">G93.32</code>
          </p>
          <p>
            <span className="font-medium">Description:</span> Myalgic
            encephalomyelitis/chronic fatigue syndrome
          </p>
          <p className="text-sm text-slate-600">
            Use this code for patients meeting IOM/NAM 2015 diagnostic criteria.
            Avoid older or nonspecific codes such as G93.3 (postviral fatigue
            syndrome) unless clearly indicated.
          </p>
        </div>
      </section>

      {/* Notes & Documentation helpers */}
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Notes</h3>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
            <li>
              Consider formal tilt-table testing if bedside measures are
              inconclusive but suspicion for OI remains high.
            </li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Documentation (Examples)
          </h3>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="font-medium">Assessment</p>
              <p className="mt-1 text-slate-700">
                Chronic multisystem illness consistent with ME/CFS. Hallmark PEM
                present; symptoms include unrefreshing sleep, cognitive
                dysfunction, and OI features. Lying→standing vitals show
                [results]. Rule-outs initiated per guideline.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="font-medium">Plan</p>
              <p className="mt-1 text-slate-700">
                Education on PEM/pacing; avoid exertion that provokes crashes.
                OI measures (fluids/salt/compression ± meds as appropriate).
                Sleep optimization and targeted symptom relief. Follow-up in 4–6
                weeks with written crash-prevention plan.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* Footer note */}
      <p className="text-center text-sm text-slate-500">
        For health professionals. Informational only — not medical advice. Based
        on IOM/NAM 2015 criteria and common clinical practices.
      </p>
    </div>
  );
}
