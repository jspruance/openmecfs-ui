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

// Shape for Plotly click event points we actually use
type PlotlyPoint = { pointIndex?: number };
type PlotlyClickEvent = {
  points?: PlotlyPoint[];
  event?: { preventDefault?: () => void };
};

export default function ScatterPlot({
  onSelectCluster,
  selectedCluster,
}: ScatterPlotProps) {
  const [points, setPoints] = useState<ScatterPoint[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/embeddings`)
      .then((res) => {
        if (!res.ok) throw new Error(`GET /embeddings ${res.status}`);
        return res.json();
      })
      .then((payload) => {
        const list = Array.isArray(payload)
          ? (payload as ScatterPoint[])
          : Array.isArray(payload?.data)
          ? (payload.data as ScatterPoint[])
          : [];
        setPoints(list);
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
                (p) => `Subtype ${p.cluster_label}<br>PMID: ${p.pmid}`
              ),
              mode: "markers",
              type: "scatter",
              marker: {
                size: 10,
                // ✅ Highlight currently selected subtype (cluster_label is numeric in /embeddings)
                color: points.map((p) =>
                  selectedCluster != null && p.cluster_label === selectedCluster
                    ? "#e11d48"
                    : "#2563eb"
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
          onClick={(e: PlotlyClickEvent) => {
            const idx = e.points?.[0]?.pointIndex;
            if (idx != null) {
              const point = points[idx];
              if (point) onSelectCluster(Number(point.cluster_label));
              e.event?.preventDefault?.();
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
