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

export default function ScatterPlot({ onSelectCluster, selectedCluster }: any) {
  const [points, setPoints] = useState<ClusterPoint[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/embeddings`)
      .then((res) => res.json())
      .then((data) => {
        // Handle Supabase/FastAPI response format safely
        if (Array.isArray(data)) {
          setPoints(data);
        } else if (Array.isArray(data?.data)) {
          setPoints(data.data);
        } else {
          console.error("Unexpected embeddings response:", data);
          setPoints([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching embeddings:", err);
        setPoints([]);
      });
  }, []);

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
              text: points.map(
                (p) => `Subtype ${p.cluster_label}<br>Paper: ${p.id}`
              ),
              mode: "markers",
              type: "scatter",
              marker: {
                size: 10,
                color: points.map((p) =>
                  p.cluster_label === selectedCluster ? "#e11d48" : "#2563eb"
                ),
                opacity: 0.85,
              },
            },
          ]}
          layout={{
            margin: { t: 30 },
            hovermode: "closest",
            xaxis: { title: "UMAP X" },
            yaxis: { title: "UMAP Y" },
          }}
          style={{ width: "100%", height: "400px" }}
          config={{ displayModeBar: false }}
          onClick={(e: any) => {
            const idx = e.points[0]?.pointIndex;
            if (idx !== undefined) {
              onSelectCluster(points[idx].cluster_label);

              // ✅ Prevent scroll jump on selection
              e.event?.preventDefault?.();
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
