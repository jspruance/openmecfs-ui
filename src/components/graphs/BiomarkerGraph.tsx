/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph2D: any = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface GraphData {
  nodes: { id: string; type: string; val?: number }[];
  links: { source: string; target: string }[];
}

export default function BiomarkerGraph() {
  const [graph, setGraph] = useState<GraphData>({ nodes: [], links: [] });

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/biomarkers/graph`)
      .then((r) => r.json())
      .then((json) => setGraph(json))
      .catch((err) => console.error("Error fetching biomarker graph:", err));
  }, []);

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 mt-8">
      <h2 className="text-lg font-semibold mb-2">
        Biomarker–Mechanism Network
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        Visualizing relationships between biomarkers and biological mechanisms
        reported in ME/CFS research.
      </p>
      <div className="w-full h-[600px]">
        {/* @ts-expect-error – nodeAutoColorBy type missing in react-force-graph */}
        <ForceGraph2D
          graphData={graph}
          nodeAutoColorBy="type"
          linkColor={() => "rgba(0,0,0,0.2)"}
          backgroundColor="#fafafa"
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = node.type === "mechanism" ? "#2563eb" : "#16a34a";
            ctx.beginPath();
            ctx.arc(
              node.x ?? 0,
              node.y ?? 0,
              node.val ?? 3,
              0,
              2 * Math.PI,
              false
            );
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.fillText(label, (node.x ?? 0) + 8, (node.y ?? 0) + 3);
          }}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.004}
        />
      </div>
    </div>
  );
}
