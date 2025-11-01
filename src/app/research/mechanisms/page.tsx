"use client";

const mechanisms = [
  { label: "Energy Metabolism & Mitochondria", icon: "🧬" },
  { label: "Immune Dysfunction & Viral Reactivation", icon: "🛡️" },
  { label: "Neurovascular & Cerebral Blood Flow", icon: "🧠💉" },
  { label: "Autonomic Nervous System & OI / POTS", icon: "⚡" },
  { label: "Neuroinflammation & Microglia", icon: "🔥" },
  { label: "HPA Axis & Hormonal Dysregulation", icon: "🧾" },
  { label: "Gut–Brain–Immune Axis & Microbiome", icon: "🦠🧠" },
  { label: "Oxidative & Nitrosative Stress", icon: "🧪" },
];

export default function MechanismsPage() {
  return (
    <main className="bg-white dark:bg-slate-900">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">ME/CFS Mechanisms</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          A structured map of the leading biological mechanisms implicated in
          ME/CFS. Explore metabolic, immune, vascular, autonomic, and
          neuroinflammatory pathways.
        </p>
      </section>

      {/* Mechanism Sections */}
      <section className="max-w-7xl mx-auto px-4 pb-16 space-y-6">
        {mechanisms.map(({ label, icon }) => (
          <div
            key={label}
            className="border rounded-lg p-6 bg-blue-50/50 dark:bg-slate-800 dark:border-slate-700 transition hover:shadow-sm"
          >
            <h2 className="text-lg font-medium mb-1 flex items-center gap-2">
              <span className="text-xl">{icon}</span> {label}
            </h2>
            <p className="text-sm text-muted-foreground">
              Coming soon — research summaries, biomarkers, key papers, and
              evidence signals.
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
