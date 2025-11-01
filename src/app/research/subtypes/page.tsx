"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClusterGrid from "./components/ClusterGrid";
import PapersPanel from "./components/PapersPanel";
import ScatterPlot from "./components/ScatterPlot";
import ThemeToggle from "./components/ThemeToggle";
import "./subtypes.css";

import { Cluster } from "./types";
import { fetchClusters } from "@/lib/api";

export const dynamic = 'force-dynamic';

function SubtypesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [selectedClusterData, setSelectedClusterData] =
    useState<Cluster | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);

  useEffect(() => {
    const loadClusters = async () => {
      const data = await fetchClusters();
      setClusters(data);

      const urlCluster = searchParams.get("cluster");
      const clusterFromUrl = urlCluster ? Number(urlCluster) : null;

      if (clusterFromUrl !== null && !isNaN(clusterFromUrl)) {
        const match = data.find((c: Cluster) => c.cluster_num === clusterFromUrl);
        if (match) {
          setSelectedCluster(clusterFromUrl);
          setSelectedClusterData(match);
          return;
        }
      }

      if (data.length > 0 && selectedCluster === null) {
        setSelectedCluster(data[0].cluster_num);
        setSelectedClusterData(data[0]);
      }
    };

    loadClusters();
  }, [searchParams, selectedCluster]); // ✅ Fix ESLint warning

  const selectCluster = (id: number) => {
    const cluster = clusters.find((c) => c.cluster_num === id) || null;
    setSelectedCluster(id);
    setSelectedClusterData(cluster);

    const params = new URLSearchParams(window.location.search);
    params.set("cluster", String(id));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="subtypes-theme">
      <section className="subtypes-hero fade-in">
        <div className="flex justify-center mb-6">
          <ThemeToggle />
        </div>
        <h1>ME/CFS Subtypes Explorer</h1>
        <p>
          Discover biological subtypes identified by the{" "}
          <strong>AI Cure engine</strong> — visualizing hidden molecular and
          immunological patterns within ME/CFS research.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 space-y-8">
        <div className="subtypes-card fade-in">
          <ScatterPlot
            onSelectCluster={selectCluster}
            selectedCluster={selectedCluster}
          />
        </div>

        <div className="flex flex-col gap-8 fade-in">
          <div className="subtypes-card min-h-[200px] pb-4">
            <ClusterGrid
              onSelectCluster={selectCluster}
              selectedCluster={selectedCluster}
            />

            {selectedClusterData && (
              <div className="mt-4 p-4 rounded-lg border bg-blue-50 dark:bg-slate-800 dark:border-slate-700">
                <h3 className="font-semibold text-lg text-blue-700 dark:text-blue-300 mb-1">
                  {selectedClusterData.cluster_label.replace(/\"/g, "")}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedClusterData.cluster_summary}
                </p>
              </div>
            )}
          </div>

          <div className="subtypes-card min-h-[400px]">
            <PapersPanel clusterId={selectedCluster} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SubtypesPage() {
  return (
    <Suspense fallback={
      <main className="subtypes-theme">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600">Loading subtypes...</p>
          </div>
        </div>
      </main>
    }>
      <SubtypesPageContent />
    </Suspense>
  );
}
