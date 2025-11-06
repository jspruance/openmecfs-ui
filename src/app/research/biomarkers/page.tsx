"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the ForceGraph to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface Biomarker {
  biomarker: string;
  count: number;
  mechanisms: string[];
}

interface GraphData {
  nodes: { id: string; type: string; val: number }[];
  links: { source: string; target: string; type: string }[];
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

    // Fetch graph data
    fetch(`${apiUrl}/biomarkers/graph`)
      .then((res) => res.json())
      .then((json: GraphData) => setGraph(json))
      .catch((err) => console.error("Failed to load biomarker graph:", err));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Biomarkers</h1>
      <p className="text-slate-600 mb-6 max-w-3xl">
        Key biological markers reported in ME/CFS studies, grouped by underlying
        mechanisms. Data are aggregated automatically from AI evidence and
        manually curated research sources.
      </p>

      {error && <p className="text-red-600">{error}</p>}
      {data.length === 0 && !error && (
        <p className="text-slate-500 italic">
          Loading biomarkers or no data found...
        </p>
      )}

      {/* List View */}
      <div className="grid gap-4">
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

      {/* Interactive Graph */}
      <div className="border rounded-lg shadow-sm bg-white p-4 mt-10">
        <h2 className="text-lg font-semibold mb-2">
          Biomarker–Mechanism Network
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Visualizing relationships between biomarkers and biological mechanisms
          reported in ME/CFS research.
        </p>
        <div className="w-full h-[600px]">
          <ForceGraph2D
            graphData={graph}
            nodeAutoColorBy="type"
            linkColor={() => "rgba(0,0,0,0.2)"}
            backgroundColor="#fafafa"
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.id;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = node.type === "mechanism" ? "#2563eb" : "#16a34a";
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, node.val || 3, 0, 2 * Math.PI, false);
              ctx.fill();
              ctx.fillStyle = "black";
              ctx.fillText(label, node.x! + 8, node.y! + 3);
            }}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.004}
          />
        </div>
      </div>
    </div>
  );
}
