"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ New correct relative imports for new folder location
import ClusterGrid from "./components/ClusterGrid";
import PapersPanel from "./components/PapersPanel";
import ScatterPlot from "./components/ScatterPlot";
import ThemeToggle from "./components/ThemeToggle";
import "./subtypes.css";

export default function SubtypesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [selectedClusterData, setSelectedClusterData] = useState<any | null>(
    null
  );
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load clusters & pre-select correct one (URL > default)
  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clusters`);
        const data = await res.json();

        setClusters(data);

        const urlCluster = searchParams.get("cluster");
        const clusterFromUrl = urlCluster ? Number(urlCluster) : null;

        const match = data.find((c: any) => c.cluster_num === clusterFromUrl);

        if (match) {
          setSelectedCluster(match.cluster_num);
          setSelectedClusterData(match);
        } else if (data.length > 0) {
          setSelectedCluster(data[0].cluster_num);
          setSelectedClusterData(data[0]);
        }
      } catch (err) {
        console.error("Failed to load clusters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  // ✅ Helper: select cluster + sync URL
  const selectCluster = (id: number) => {
    const cluster = clusters.find((c: any) => c.cluster_num === id);

    setSelectedCluster(id);
    setSelectedClusterData(cluster || null);

    const params = new URLSearchParams(window.location.search);
    params.set("cluster", String(id));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-center text-gray-600">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading subtypes…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="subtypes-theme">
      {/* Hero */}
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

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 pb-16 space-y-8">
        {/* Scatter Plot */}
        <div className="subtypes-card fade-in">
          <ScatterPlot
            onSelectCluster={(id) => selectCluster(id)}
            selectedCluster={selectedCluster}
          />
        </div>

        {/* Cluster selection + papers */}
        <div className="flex flex-col gap-8 fade-in">
          <div className="subtypes-card min-h-[200px] pb-4">
            <ClusterGrid
              onSelectCluster={(id) => selectCluster(id)}
              selectedCluster={selectedCluster}
            />

            {/* Selected cluster summary */}
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

          {/* Papers */}
          <div className="subtypes-card min-h-[400px]">
            <PapersPanel clusterId={selectedCluster} />
          </div>
        </div>
      </section>
    </main>
  );
}
