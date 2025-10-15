// src/app/providers/differential/page.tsx
import { provider } from "@/lib/providerContent";
import type { Differential } from "@/lib/providerContent";

export const metadata = {
  title: "Differential & Workup — Open ME/CFS",
  description: "Rule-outs and baseline tests for ME/CFS workup.",
};

// Narrow the imported provider without using `any`
type ProviderWithDifferential = {
  differential?: Differential;
  footer?: string;
};

// Fallback content so TS knows fields exist
const FALLBACK: Differential = {
  title: "Differential & Workup",
  intro:
    "Common rule-outs and baseline tests to support a clinical diagnosis of ME/CFS.",
  tests: [],
  mimics: [],
};

export default function DifferentialPage() {
  const p = provider as ProviderWithDifferential | undefined;
  const d: Differential = p?.differential ?? FALLBACK;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
        <h1 className="text-2xl font-bold">{d.title ?? FALLBACK.title}</h1>
        {d.intro ? (
          <p className="mt-2 text-blue-50 max-w-2xl">{d.intro}</p>
        ) : null}
      </header>

      <section className="rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Baseline / Targeted Tests
        </h2>
        {d.tests && d.tests.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {d.tests.map((t, i) => (
              <li key={i} className="text-gray-700 list-disc pl-5">
                {t}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-600 text-sm">No tests listed yet.</p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900">Common Mimics</h2>
        {d.mimics && d.mimics.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {d.mimics.map((m, i) => (
              <li key={i} className="text-gray-700 list-disc pl-5">
                {m}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-600 text-sm">No mimics listed yet.</p>
        )}
      </section>

      {p?.footer ? <p className="text-xs text-slate-500">{p.footer}</p> : null}
    </div>
  );
}
