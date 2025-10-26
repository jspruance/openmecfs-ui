"use client";

import { useState } from "react";
import ClusterGrid from "./components/ClusterGrid";
import PapersPanel from "./components/PapersPanel";
import ScatterPlot from "./components/ScatterPlot";

export default function SubtypesPage() {
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">ME/CFS Subtypes Explorer</h1>
        <p className="text-gray-600 text-sm">
          Visualize biological subtypes discovered by the AI Cure engine and
          explore their related research papers.
        </p>
      </header>

      {/* --- Visualization Layer --- */}
      <ScatterPlot
        onSelectCluster={setSelectedCluster}
        selectedCluster={selectedCluster}
      />

      {/* --- Split View: Clusters + Papers --- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClusterGrid
          onSelectCluster={setSelectedCluster}
          selectedCluster={selectedCluster}
        />
        <PapersPanel clusterId={selectedCluster} />
      </section>
    </main>
  );
}
