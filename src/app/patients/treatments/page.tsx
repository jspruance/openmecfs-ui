// app/patients/treatments/page.tsx
import Link from "next/link";
import {
  Activity,
  HeartPulse,
  Pill,
  Syringe,
  Beaker,
  Battery,
  Info,
} from "lucide-react";

export const metadata = {
  title: "Treatments & Approaches — Open ME/CFS",
  description:
    "Overview of symptom-management approaches for ME/CFS: pacing, OI treatments, LDN, supplements, mitochondrial support, antivirals, and more.",
};

type Card = {
  title: string;
  icon: React.ReactNode;
  tag: "Core" | "Rx" | "Supportive" | "Experimental";
  summary: string;
  bullets: string[];
  caution?: string;
};

const CARDS: Card[] = [
  {
    title: "Pacing (Energy Management)",
    icon: <Activity className="text-blue-600" />,
    tag: "Core",
    summary:
      "Foundational strategy to avoid post-exertional malaise (PEM): balance activity and rest to stay within your energy envelope.",
    bullets: [
      "Track triggers and delayed crashes (often 24–48h later).",
      "Use heart-rate pacing or activity caps to prevent overexertion.",
      "Prioritize tasks, pre-emptive rest, and gentle, spread-out routines.",
    ],
  },
  {
    title: "Orthostatic Intolerance (OI) Treatments",
    icon: <HeartPulse className="text-blue-600" />,
    tag: "Rx",
    summary:
      "For symptoms that worsen upright (lightheadedness, palpitations, ‘brain fog’). Treating OI can meaningfully improve function.",
    bullets: [
      "Non-Rx: fluids, salt (if safe), compression garments, reclined work.",
      "Medications (discuss with a clinician): fludrocortisone, midodrine, beta-blockers, ivabradine, pyridostigmine.",
      "Screen with active stand / NASA lean; consider autonomic referral.",
    ],
    caution:
      "Medication choice depends on blood pressure/heart rate phenotype; requires medical supervision.",
  },
  {
    title: "Low-Dose Naltrexone (LDN)",
    icon: <Pill className="text-blue-600" />,
    tag: "Rx",
    summary:
      "Immune-modulating therapy (commonly 0.5–4.5 mg) reported to help pain, sleep, and sometimes cognition for some patients.",
    bullets: [
      "Start low, titrate slowly to tolerance.",
      "Often compounded; nighttime dosing is common.",
      "Monitor for vivid dreams, insomnia, or headaches early on.",
    ],
    caution:
      "Evidence is emerging; responses vary. Avoid with opioids (may block analgesia).",
  },
  {
    title: "Low-Dose Aripiprazole (LDA)",
    icon: <Beaker className="text-blue-600" />,
    tag: "Experimental",
    summary:
      "Very low doses (e.g., 0.25–2 mg) have anecdotal/early reports of benefit for fatigue and PEM in some individuals.",
    bullets: [
      "Start extremely low and move slowly if tried.",
      "Track benefits vs. side effects carefully.",
      "Consider only with a clinician familiar with risks.",
    ],
    caution:
      "Potential adverse effects (akathisia, restlessness, metabolic changes). Evidence remains limited.",
  },
  {
    title: "Antivirals (selected cases)",
    icon: <Syringe className="text-blue-600" />,
    tag: "Rx",
    summary:
      "In a subset with documented herpesvirus reactivation, antivirals (e.g., valganciclovir, famciclovir) may be considered by specialists.",
    bullets: [
      "Use only after targeted testing and clinical evaluation.",
      "Regular labs may be required to monitor safety.",
      "Benefits are mixed; best in carefully selected patients.",
    ],
    caution:
      "Prescription-only with non-trivial risk profiles; specialist oversight recommended.",
  },
  {
    title: "Mitochondrial Support",
    icon: <Battery className="text-blue-600" />,
    tag: "Supportive",
    summary:
      "Nutrient support aimed at cellular energy metabolism; some patients report incremental benefits.",
    bullets: [
      "Common options: CoQ10/Ubiquinol, magnesium, riboflavin (B2), B12, acetyl-L-carnitine, creatine, NAD+/niacin.",
      "Address deficiencies first (e.g., vitamin D, iron/ferritin).",
      "Introduce one at a time; keep a response log.",
    ],
    caution:
      "Evidence quality varies; watch for interactions and over-supplementation.",
  },
  {
    title: "General Supplements & Symptom Aids",
    icon: <Pill className="text-blue-600" />,
    tag: "Supportive",
    summary:
      "Targeted supplementation may help sleep, pain, or inflammation for some people.",
    bullets: [
      "Examples sometimes used: vitamin D repletion, omega-3, magnesium glycinate, melatonin, antihistamines for MCAS-like symptoms (discuss with a clinician).",
      "Treat comorbidities (e.g., anemia, thyroid, sleep apnea) when present.",
      "Start low/slow; avoid frequent changes to see true effects.",
    ],
  },
];

function Tag({ label }: { label: Card["tag"] }) {
  const cls =
    label === "Core"
      ? "bg-blue-50 text-blue-700 ring-blue-100"
      : label === "Rx"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : label === "Supportive"
      ? "bg-indigo-50 text-indigo-700 ring-indigo-100"
      : "bg-amber-50 text-amber-700 ring-amber-100";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {label}
    </span>
  );
}

export default function TreatmentsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Treatments & Approaches
        </h1>
        <p className="mt-3 text-gray-700 max-w-3xl">
          There’s no single approved cure for ME/CFS yet, but many people
          benefit from a mix of pacing, orthostatic intolerance management,
          sleep and pain support, and carefully selected therapies. Responses
          vary—go low and slow, and work with a clinician.
        </p>
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <Info size={14} />
          Educational only — not medical advice.
        </p>
      </header>

      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CARDS.map((c) => (
          <article
            key={c.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-50">{c.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {c.title}
                  </h2>
                  <Tag label={c.tag} />
                </div>
                <p className="mt-1 text-gray-700 text-sm">{c.summary}</p>
              </div>
            </div>

            <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
              {c.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            {c.caution && (
              <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md p-2">
                <strong>Caution:</strong> {c.caution}
              </p>
            )}
          </article>
        ))}
      </section>

      <footer className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/patients/faq"
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700"
        >
          Patient FAQ
        </Link>
        <Link
          href="/patients/doctors"
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700"
        >
          Clinicians & Centers
        </Link>
        <Link
          href="/mecfs"
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700"
        >
          What is ME/CFS?
        </Link>
      </footer>
    </main>
  );
}
