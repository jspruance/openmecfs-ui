// app/patients/one-pager/page.tsx
"use client";

import { useCallback } from "react";
import { Download } from "lucide-react";

export default function MecfsOnePager() {
  const onPrint = useCallback(() => window.print(), []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Toolbar (hidden when printing) */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">ME/CFS — 1-Page Summary</h1>
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 cursor-pointer"
            type="button"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
        <hr className="border-slate-200" />
      </div>

      {/* Sheet */}
      <section className="mx-auto my-6 max-w-3xl px-4 print:my-0">
        {/* IMPORTANT: id ensures we can target only this for print */}
        <article
          id="one-pager"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:border-0 print:p-0 print:shadow-none"
        >
          {/* Header */}
          <header className="mb-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Myalgic Encephalomyelitis / Chronic Fatigue Syndrome (ME/CFS)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Concise overview for clinicians, patients, and families.
            </p>
          </header>

          {/* What is ME/CFS */}
          <section className="mt-4">
            <h3 className="text-base font-semibold">What is ME/CFS?</h3>
            <p className="mt-1 text-sm leading-6 text-slate-800">
              ME/CFS is a serious, chronic, multisystem disease that disrupts
              energy production, autonomic regulation, and immune function. Core
              features include<strong> post-exertional malaise (PEM)</strong>{" "}
              (symptom worsening after even minor effort),{" "}
              <strong>unrefreshing sleep</strong>,{" "}
              <strong>cognitive dysfunction</strong> (“brain fog”), and often{" "}
              <strong>orthostatic intolerance (OI)</strong>. It is recognized by
              the U.S. National Academy of Medicine (IOM/NAM) as a biological
              illness.
            </p>
          </section>

          {/* IOM Criteria */}
          <section className="mt-4">
            <h3 className="text-base font-semibold">
              IOM/NAM 2015 Diagnostic Criteria
            </h3>
            <ul className="mt-1 list-inside list-disc text-sm leading-6">
              <li>
                Substantial reduction/impairment in activity for &gt; 6 months
                due to fatigue not alleviated by rest.
              </li>
              <li>
                <strong>Post-exertional malaise (PEM).</strong>
              </li>
              <li>
                <strong>Unrefreshing sleep.</strong>
              </li>
              <li>
                At least one: <strong>cognitive impairment</strong> or{" "}
                <strong>orthostatic intolerance (OI)</strong>.
              </li>
            </ul>
          </section>

          {/* Symptoms */}
          <section className="mt-4">
            <h3 className="text-base font-semibold">Common Symptoms</h3>
            <ul className="mt-1 grid grid-cols-1 gap-x-6 gap-y-1 text-sm leading-6 md:grid-cols-2">
              <li>Worsening after exertion (PEM), often delayed 24–48 h</li>
              <li>Brain fog, slowed processing, memory issues</li>
              <li>Lightheadedness, palpitations when upright (OI)</li>
              <li>Unrefreshing or fragmented sleep</li>
              <li>Widespread pain, sensory overload</li>
              <li>Headaches, sore throat, tender lymph nodes, GI issues</li>
            </ul>
          </section>

          {/* Diagnosis */}
          <section className="mt-4">
            <h3 className="text-base font-semibold">Diagnosis (Clinical)</h3>
            <p className="mt-1 text-sm leading-6">
              No single lab test. Diagnose clinically using IOM criteria and by
              excluding alternative explanations. Key steps:
            </p>
            <ul className="mt-1 list-inside list-disc text-sm leading-6">
              <li>
                History focused on PEM, sleep, cognition, and upright tolerance.
              </li>
              <li>
                Physical exam with orthostatic vitals (lying/standing or 10-min
                stand).
              </li>
              <li>
                Review medications, comorbidities (POTS, MCAS, hEDS, migraine,
                etc.).
              </li>
            </ul>
          </section>

          {/* Testing */}
          <section className="mt-4">
            <h3 className="text-base font-semibold">
              Testing (Rule-Outs & Baseline)
            </h3>
            <p className="mt-1 text-sm leading-6">
              Targeted testing helps exclude common mimics/contributors and
              establish baselines (adapt to patient context):
            </p>
            <ul className="mt-1 grid grid-cols-1 gap-x-6 gap-y-1 text-sm leading-6 md:grid-cols-2">
              <li>CBC, CMP, TSH/Free T4</li>
              <li>Ferritin/iron studies, B12, folate, vitamin D</li>
              <li>CRP/ESR; ANA if autoimmune features</li>
              <li>Morning cortisol if adrenal concern</li>
              <li>HbA1c, lipids as indicated</li>
              <li>Sleep evaluation if symptoms suggest OSA/PLMD</li>
              <li>
                Orthostatic testing (lying/standing; consider tilt when
                appropriate)
              </li>
              <li>Additional tests driven by history/exam</li>
            </ul>
          </section>

          {/* Management */}
          <section className="mt-4">
            <h3 className="text-base font-semibold">
              Management (Symptom-Directed)
            </h3>
            <ul className="mt-1 list-inside list-disc text-sm leading-6">
              <li>
                <strong>Pacing & energy management:</strong> stay within the
                “energy envelope” to reduce PEM; activity should not provoke
                crashes.
              </li>
              <li>
                <strong>Sleep:</strong> hygiene, melatonin or low-dose agents
                for restorative sleep.
              </li>
              <li>
                <strong>OI:</strong> fluids/salt, compression, and medications
                (e.g., fludrocortisone, midodrine, beta-blockers) as clinically
                appropriate.
              </li>
              <li>
                <strong>Pain & symptom control:</strong> multimodal approach
                (neuropathic agents, headache care, migraine prevention).
              </li>
              <li>
                <strong>Adjuncts:</strong> treat nutrient deficiencies (D, B12,
                ferritin); consider low dose naltrexone (LDN) in shared
                decision-making.
              </li>
            </ul>
          </section>

          {/* Footer */}
          <footer className="mt-6 border-t border-slate-200 pt-3 text-[11px] leading-5 text-slate-600">
            <p>
              This sheet summarizes widely used guidance (IOM/NAM 2015 criteria)
              and common clinical approaches. Informational only—does not
              replace medical advice.
            </p>
            <p className="mt-1">
              More at:{" "}
              <span className="font-medium text-slate-900">Open ME/CFS</span>.
            </p>
          </footer>
        </article>
      </section>

      {/* Print styles (plain <style>) — print only #one-pager */}
      <style>{`
        @page { size: A4; margin: 14mm; }
        @media print {
          html, body { background: #ffffff !important; }
          /* Hide everything by default */
          body * { visibility: hidden; }
          /* Only show the sheet */
          #one-pager, #one-pager * { visibility: visible; }
          #one-pager { position: absolute; left: 0; top: 0; width: auto; margin: 0; }
          /* Prevent Chrome from appending link URLs */
          a[href]:after { content: ""; }
        }
      `}</style>
    </main>
  );
}
