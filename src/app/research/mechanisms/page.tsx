"use client";

import { mechanisms } from "./data";
import MechanismCard from "./components/MechanismCard";

export default function MechanismsPage() {
  return (
    <main className="bg-white dark:bg-slate-900">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">ME/CFS Mechanisms</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          A structured map of the leading biological pathways implicated in
          ME/CFS. Explore immune, metabolic, vascular, autonomic, and
          neuroinflammatory mechanisms — and how they connect to symptoms and
          subtypes.
        </p>
      </section>

      {/* Mechanism Cards */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mechanisms.map((mech) => (
            <MechanismCard key={mech.id} mech={mech} />
          ))}
        </div>
      </section>
    </main>
  );
}
