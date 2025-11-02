"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClusterGrid from "./components/ClusterGrid";
import PapersPanel from "./components/PapersPanel";
import ScatterPlot from "./components/ScatterPlot";
import "./subtypes.css";

import { Cluster } from "./types";
import { fetchClusters } from "@/lib/api";
import ClusterIntelligence from "./components/ClusterIntelligence";

export const dynamic = "force-dynamic";

function SubtypesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [selectedClusterData, setSelectedClusterData] =
    useState<Cluster | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [activeView, setActiveView] = useState<"papers" | "map">("papers");

  useEffect(() => {
    const loadClusters = async () => {
      const data = await fetchClusters();
      setClusters(data);

      const urlCluster = searchParams.get("cluster");
      const clusterFromUrl = urlCluster ? Number(urlCluster) : null;

      if (clusterFromUrl !== null && !isNaN(clusterFromUrl)) {
        const match = data.find(
          (c: Cluster) => c.cluster_num === clusterFromUrl
        );
        if (match && match.cluster_num !== selectedCluster) {
          setSelectedCluster(match.cluster_num);
          setSelectedClusterData(match);
        }
        return;
      }

      if (data.length > 0 && selectedCluster === null) {
        setSelectedCluster(data[0].cluster_num);
        setSelectedClusterData(data[0]);
      }
    };

    loadClusters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const selectCluster = (id: number) => {
    const cluster = clusters.find((c) => c.cluster_num === id) || null;
    setSelectedCluster(id);
    setSelectedClusterData(cluster);

    const params = new URLSearchParams(window.location.search);
    params.set("cluster", String(id));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="bg-white dark:bg-slate-900">
      {/* ✅ Research-app style header, matching Papers page */}
      <section className="max-w-7xl mx-auto px-4 pt-0 pb-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold mb-2">
              ME/CFS Subtypes Explorer
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Understand biological subtypes identified by the{" "}
              <strong>AI Cure engine</strong>. Explore patterns in molecular,
              immune, and neurological research.
            </p>
          </div>
          {/* ✅ View switcher tabs */}
          <div className="flex gap-2 border border-gray-300 dark:border-slate-600 rounded-md p-1 bg-gray-50 dark:bg-slate-800">
            <button
              onClick={() => setActiveView("papers")}
              className={`px-4 py-2 text-sm font-medium rounded transition cursor-pointer whitespace-nowrap ${
                activeView === "papers"
                  ? "bg-white text-blue-700 dark:bg-slate-700 dark:text-blue-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Papers
            </button>
            <button
              onClick={() => setActiveView("map")}
              className={`px-4 py-2 text-sm font-medium rounded transition cursor-pointer whitespace-nowrap ${
                activeView === "map"
                  ? "bg-white text-blue-700 dark:bg-slate-700 dark:text-blue-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 space-y-8 fade-in">
        {/* ✅ Subtype pills - only show on Papers tab */}
        {activeView === "papers" && (
          <div className="subtypes-card pb-4">
            <ClusterGrid
              onSelectCluster={selectCluster}
              selectedCluster={selectedCluster}
            />

            {selectedCluster !== null &&
              selectedClusterData &&
              selectedClusterData.cluster_num === selectedCluster && (
                <>
                  <div className="mt-4 p-4 rounded-lg border bg-blue-50 dark:bg-slate-800 dark:border-slate-700">
                    <h3 className="font-semibold text-lg text-blue-700 dark:text-blue-300 mb-1">
                      {selectedClusterData.cluster_label.replace(/\"/g, "")}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedClusterData.cluster_summary}
                    </p>
                  </div>

                  <ClusterIntelligence cluster={selectedClusterData} />
                </>
              )}
          </div>
        )}

        {/* ✅ Content view - switch between Papers and Map */}
        {activeView === "papers" ? (
          <div className="subtypes-card min-h-[400px]">
            <PapersPanel clusterId={selectedCluster} />
          </div>
        ) : (
          <div className="subtypes-card fade-in">
            <ScatterPlot
              onSelectCluster={selectCluster}
              selectedCluster={selectedCluster}
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default function SubtypesPage() {
  return (
    <Suspense
      fallback={
        <main className="subtypes-theme">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600">Loading subtypes...</p>
            </div>
          </div>
        </main>
      }
    >
      <SubtypesPageContent />
    </Suspense>
  );
}
