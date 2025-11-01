"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type Cluster = {
  id: string;
  cluster_num: number;
  cluster_label: string;
  keywords: string[];
  cluster_summary: string;
};

interface Props {
  onSelectCluster: (id: number, cluster: Cluster) => void;
  selectedCluster: number | null;
}

export default function ClusterGrid({
  onSelectCluster,
  selectedCluster,
}: Props) {
  const [clusters, setClusters] = useState<Cluster[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clusters`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const payload = await res.json();
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];

        if (!Array.isArray(list)) {
          console.error("Unexpected /clusters response:", payload);
          setClusters([]);
          return;
        }

        setClusters(list);
      } catch (err) {
        console.error("Failed to load clusters:", err);
        setClusters([]);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (clusters.length > 0 && selectedCluster === null) {
      onSelectCluster(clusters[0].cluster_num, clusters[0]);
    }
  }, [clusters, selectedCluster, onSelectCluster]);

  return (
    <div className="space-y-4 mb-2">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Biological Subtypes
      </h2>

      <div className="flex flex-wrap gap-3">
        {clusters.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCluster(c.cluster_num, c)}
            className={clsx(
              "px-4 py-2 rounded-full border text-sm whitespace-nowrap transition shadow-sm cursor-pointer",
              selectedCluster === c.cluster_num
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
          >
            {c.cluster_label.replace(/\"/g, "")}
          </button>
        ))}
      </div>
    </div>
  );
}
