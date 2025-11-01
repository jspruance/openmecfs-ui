"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { ScatterPoint } from "../types"; // ✅ shared type

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
      .then((data) => {
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
                (p) => `Subtype ${p.cluster_num}<br>Paper: ${p.id}`
              ),
              mode: "markers",
              type: "scatter",
              marker: {
                size: 10,
                color: points.map((p) =>
                  p.cluster_num === selectedCluster ? "#e11d48" : "#2563eb"
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
          onClick={(e: Plotly.PlotMouseEvent) => {
            const idx = e.points[0]?.pointIndex;
            if (idx !== undefined) {
              const point = points[idx];
              if (point) {
                onSelectCluster(point.cluster_num);
              }
              e.event?.preventDefault?.();
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
