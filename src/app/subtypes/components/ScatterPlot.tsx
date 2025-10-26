"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type ClusterPoint = {
  id: string;
  cluster_label: number;
  x: number;
  y: number;
};

interface Props {
  onSelectCluster: (id: number) => void;
  selectedCluster: number | null;
}

export default function ScatterPlot({
  onSelectCluster,
  selectedCluster,
}: Props) {
  const [points, setPoints] = useState<ClusterPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clusters`);
        if (!res.ok) throw new Error("Failed to fetch cluster data");
        const data = await res.json();
        // Expect each cluster to have x, y coordinates
        setPoints(
          data.filter((d: any) => d.x !== undefined && d.y !== undefined)
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, []);

  if (loading)
    return <div className="h-72 w-full rounded-xl bg-gray-200 animate-pulse" />;

  if (error) return <p className="text-red-500">Error loading plot: {error}</p>;

  if (!points.length)
    return <p className="text-gray-500 italic">No embedding data available.</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Subtype Embedding Map</CardTitle>
      </CardHeader>
      <CardContent>
        <Plot
          data={[
            {
              x: points.map((p) => p.x),
              y: points.map((p) => p.y),
              text: points.map((p) => `Subtype ${p.cluster_label}`),
              mode: "markers",
              marker: {
                size: 10,
                color: points.map((p) =>
                  p.cluster_label === selectedCluster ? "red" : "blue"
                ),
                opacity: 0.8,
              },
              type: "scatter",
            },
          ]}
          layout={{
            autosize: true,
            hovermode: "closest",
            margin: { l: 40, r: 20, t: 30, b: 40 },
            xaxis: { title: "Dimension 1" },
            yaxis: { title: "Dimension 2" },
          }}
          style={{ width: "100%", height: "400px" }}
          onClick={(ev) => {
            const point = ev.points?.[0];
            if (point) {
              const label = points[point.pointIndex].cluster_label;
              onSelectCluster(label);
            }
          }}
          config={{ displayModeBar: false }}
        />
      </CardContent>
    </Card>
  );
}
