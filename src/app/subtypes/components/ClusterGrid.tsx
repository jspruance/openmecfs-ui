"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Cluster = {
  id: string;
  cluster_label: number;
  keywords: string[];
  cluster_summary: string;
};

interface Props {
  onSelectCluster: (id: number) => void;
  selectedCluster: number | null;
}

export default function ClusterGrid({
  onSelectCluster,
  selectedCluster,
}: Props) {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clusters`);
        if (!res.ok) throw new Error("Failed to fetch clusters");
        const data = await res.json();
        setClusters(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClusters();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Biological Subtypes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clusters.map((cluster) => (
          <Card
            key={cluster.id}
            onClick={() => onSelectCluster(cluster.cluster_label)}
            className={`cursor-pointer transition ${
              selectedCluster === cluster.cluster_label
                ? "border-blue-500 shadow-lg"
                : "hover:border-blue-300"
            }`}
          >
            <CardHeader>
              <CardTitle>Subtype {cluster.cluster_label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-2">
                {cluster.cluster_summary || "No summary available"}
              </p>
              <p className="text-xs text-gray-500 italic">
                Keywords: {cluster.keywords?.join(", ") || "None"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
