// app/patients/faq/page.tsx

export const metadata = {
  title: "Patient FAQ — Open ME/CFS",
  description:
    "Frequently asked questions for people living with or exploring ME/CFS.",
};

import type { ReactNode } from "react";

type QA = { q: string; a: ReactNode };

const FAQ: QA[] = [
  {
    q: "What should I do if I think I have ME/CFS?",
    a: (
      <div className="space-y-2">
        <p>
          Start by documenting your symptoms and how they limit your activities.
          The 2015 IOM/NAM criteria emphasize four features:{" "}
          <strong>substantial reduction in activity ≥ 6 months</strong>,{" "}
          <strong>post-exertional malaise (PEM)</strong>,{" "}
          <strong>unrefreshing sleep</strong>, and{" "}
          <strong>cognitive impairment or orthostatic intolerance (OI)</strong>.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>
            Track crashes/PEM (what triggered them, onset delay, duration).
          </li>
          <li>
            Try gentle <strong>pacing</strong> now—stay within your energy
            envelope to avoid worsening.
          </li>
          <li>
            Schedule a general medical workup to rule out other conditions (iron
            deficiency, thyroid disease, sleep apnea, autoimmune issues, etc.).
          </li>
          <li>
            Discuss <strong>orthostatic symptoms</strong> with a clinician; ask
            about active stand / NASA lean testing or referral for autonomic
            evaluation.
          </li>
          <li>
            Bring a simple summary (1–2 pages) describing symptoms against the
            IOM criteria and how your function has changed.
          </li>
        </ul>
      </div>
    ),
  },
  {
    q: "My doctor doesn’t believe me or isn’t familiar with ME/CFS — what can I do?",
    a: (
      <div className="space-y-2">
        <p>
          Unfortunately this is common. You deserve compassionate,
          evidence-based care. Practical steps:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>
            Bring concise documentation (symptom timeline, activity reduction,
            PEM examples, IOM summary). Keep it under two pages.
          </li>
          <li>
            Ask for specific evaluations: basic labs, sleep assessment, and OI
            screening if symptoms worsen upright.
          </li>
          <li>
            If dismissed, seek a <strong>second opinion</strong>—preferably a
            clinician familiar with ME/CFS or dysautonomia (see our directory).
          </li>
          <li>
            Consider bringing a supportive person to appointments and using
            patient portals for written follow-ups.
          </li>
          <li>
            If needed, request copies of your records and lab results to share
            with other clinicians.
          </li>
        </ul>
      </div>
    ),
  },
  {
    q: "What is Post-Exertional Malaise (PEM)?",
    a: "A delayed worsening of symptoms after even minor physical or mental effort—often peaking 24–48 hours later and lasting days or longer. PEM is a hallmark of ME/CFS.",
  },
  {
    q: "What’s Orthostatic Intolerance (OI)?",
    a: "Symptoms that worsen on standing or sitting upright due to autonomic/blood-flow issues (e.g., lightheadedness, palpitations, brain fog). OI is common in ME/CFS and may be treatable.",
  },
  {
    q: "How is ME/CFS diagnosed?",
    a: "There’s no single definitive lab test. Diagnosis is clinical using criteria (e.g., 2015 IOM/NAM) and requires excluding other causes. A detailed history and basic testing help rule out alternatives.",
  },
  {
    q: "Are there treatments?",
    a: "There’s no FDA-approved cure yet, but pacing/energy management, sleep support, pain management, and OI therapies (fluids/salt, compression, and medications discussed with a clinician) can improve quality of life.",
  },
  {
    q: "Should I try graded exercise therapy?",
    a: "Not recommended for ME/CFS. Exercise that ignores PEM can worsen illness. Focus on pacing and symptom-informed activity within your energy envelope.",
  },
  {
    q: "Where can I find clinicians?",
    a: "See the Clinicians & Centers directory in the Patients section. Always verify availability and expertise before scheduling.",
  },
  {
    q: "How is ME/CFS related to Long COVID?",
    a: "A subset of people with Long COVID meet ME/CFS criteria, especially when PEM and OI are present. Approaches like pacing and OI management often overlap.",
  },
  {
    q: "Is this site medical advice?",
    a: "No. It’s educational only and not a substitute for professional diagnosis or treatment. Please consult a qualified clinician.",
  },
];

export default function PatientFAQPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Patient FAQ</h1>
      <p className="mt-2 text-gray-700">
        Quick answers to common questions. Educational only — not medical advice
        or diagnosis.
      </p>

      <div className="mt-6 space-y-3">
        {FAQ.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-gray-200 p-4 open:bg-gray-50"
          >
            <summary className="cursor-pointer list-none font-medium text-gray-900">
              {item.q}
            </summary>
            <div className="mt-2 text-gray-700 text-sm">{item.a}</div>
          </details>
        ))}
      </div>

      <p className="mt-6 text-xs text-gray-500">
        This information is for general education and may not apply to your
        situation.
      </p>
    </main>
  );
}
