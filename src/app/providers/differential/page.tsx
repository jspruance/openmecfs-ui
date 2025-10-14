// src/app/providers/differential/page.tsx
import { provider } from "@/lib/providerContent";

export const metadata = {
  title: "Differential & Workup — Open ME/CFS",
  description: "Rule-outs and baseline tests for ME/CFS workup.",
};

export default function DifferentialPage() {
  const w = provider.workup;
  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
        <h1 className="text-2xl font-bold">{w.title}</h1>
        <p className="mt-2 text-blue-50 max-w-2xl">{w.intro}</p>
      </header>

      <section className="rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Baseline / Targeted Tests
        </h2>

        <ul className="mt-2 space-y-2">
          {w.lists.map((row, i) => (
            <li key={i} className="text-gray-700 list-disc pl-5">
              {row.join(", ")}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-slate-500">{provider.footer}</p>
    </div>
  );
}
