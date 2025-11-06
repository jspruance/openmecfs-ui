/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D: any = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface Biomarker {
  biomarker: string;
  count: number;
  mechanisms: string[];
}

interface GraphData {
  nodes: { id: string; type: string; val?: number }[];
  links: { source: string; target: string }[];
}

export default function BiomarkersPage() {
  const [data, setData] = useState<Biomarker[]>([]);
  const [graph, setGraph] = useState<GraphData>({ nodes: [], links: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Fetch biomarker list
    fetch(`${apiUrl}/biomarkers/`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to load biomarkers (${res.status})`);
        return res.json();
      })
      .then((json: Biomarker[]) => setData(json))
      .catch((err) => setError(err.message));

    // Fetch biomarker–mechanism graph
    fetch(`${apiUrl}/biomarkers/graph`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to load biomarker graph (${res.status})`);
        return res.json();
      })
      .then((json) => setGraph(json))
      .catch((err) => console.error("Graph fetch error:", err));
  }, []);

  // -------------------- JSX --------------------
  return (
    <div className="mx-auto max-w-6xl px-6 py-0">
      {/* ------------------- Biomarker Cards ------------------- */}
      <h1 className="text-2xl font-semibold mb-4">Biomarkers</h1>
      <p className="text-slate-600 mb-6 max-w-3xl">
        Key biological markers reported in ME/CFS studies, grouped by underlying
        mechanisms. Data are aggregated automatically from AI evidence and
        manually curated research sources.
      </p>

      {/* ------------------- Graph Section ------------------- */}
      <div className="border border-slate-200 rounded-lg shadow-sm bg-white p-5 mb-10 overflow-hidden">
        <h2 className="text-xl font-semibold mb-2">
          Biomarker–Mechanism Network
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Visualizing relationships between biomarkers and biological mechanisms
          reported in ME/CFS research.
        </p>

        <div className="w-full h-[700px] overflow-hidden rounded-md">
          <ForceGraph2D
            graphData={graph as any}
            nodeAutoColorBy="type"
            linkColor={() => "rgba(0,0,0,0.2)"}
            backgroundColor="#fafafa"
            nodeRelSize={8}
            cooldownTicks={60}
            d3VelocityDecay={0.25}
            d3AlphaDecay={0.03}
            width={
              typeof window !== "undefined" ? window.innerWidth * 0.85 : 900
            }
            nodeCanvasObject={(
              node: any,
              ctx: CanvasRenderingContext2D,
              globalScale: number
            ) => {
              const label = node.id;
              const fontSize = 14 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = node.type === "mechanism" ? "#2563eb" : "#16a34a"; // blue vs green
              ctx.beginPath();
              ctx.arc(node.x ?? 0, node.y ?? 0, node.val ?? 5, 0, 2 * Math.PI);
              ctx.fill();
              ctx.fillStyle = "black";
              ctx.fillText(label, (node.x ?? 0) + 8, (node.y ?? 0) + 3);
            }}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.004}
          />
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {data.length === 0 && !error && (
        <p className="text-slate-500 italic">
          Loading biomarkers or no data found...
        </p>
      )}

      <div className="grid gap-4 mb-10">
        {data.map((b) => (
          <div
            key={b.biomarker}
            className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <h3 className="font-semibold text-slate-900">{b.biomarker}</h3>
            <p className="text-sm text-slate-600 mt-1">
              Reported in {b.count} studies
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Mechanisms:{" "}
              <span className="italic">{b.mechanisms.join(", ")}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
