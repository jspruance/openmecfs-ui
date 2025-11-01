"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScatterPoint } from "../types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface ScatterPlotProps {
  onSelectCluster: (id: number) => void;
  selectedCluster: number | null;
}

export default function ScatterPlot({
  onSelectCluster,
  selectedCluster,
}: ScatterPlotProps) {
  const [points, setPoints] = useState<ScatterPoint[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/embeddings`)
      .then((res) => res.json())
      .then((payload: unknown) => {
        const list = Array.isArray(payload)
          ? payload
          : typeof payload === "object" &&
            payload &&
            Array.isArray((payload as any).data)
          ? (payload as any).data
          : [];

        setPoints(list as ScatterPoint[]);
      })
      .catch((err: unknown) => {
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
                (p) => `Subtype ${p.cluster_label}<br>PMID: ${p.pmid}`
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
          onClick={(e: Readonly<any>) => {
            const idx: number | undefined = e?.points?.[0]?.pointIndex;
            if (typeof idx === "number") {
              const point = points[idx];
              if (point) onSelectCluster(point.cluster_label);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
