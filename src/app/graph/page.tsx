"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// ✅ Pure 2D bundle — avoids rogue WebGL/WebVR overlays
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface GraphNode {
  id: string;
  label: string;
  type: "paper" | "mechanism" | "biomarker";
  size?: number;
  meta?: { one_sentence?: string };
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export default function GraphPage() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/graph?limit=300`;
    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: GraphData) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  const drawNode = (
    node: GraphNode,
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const size = Math.max(4, Math.min(18, (node.size || 1) * 2));

    const colors = {
      paper: "#2563eb",
      mechanism: "#f59e0b",
      biomarker: "#10b981",
    };

    ctx.fillStyle = colors[node.type] || "#64748b";
    ctx.beginPath();
    ctx.arc(node.x ?? 0, node.y ?? 0, size, 0, 2 * Math.PI);
    ctx.fill();

    if (!node.label) return;
    const fontSize = 12 / scale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#111827";
    ctx.fillText(node.label, (node.x ?? 0) + size + 3, node.y ?? 0);
  };

  const handleNodeClick = (node: GraphNode) => {
    if (node.type === "paper") {
      const pmid = node.id.replace("paper:", "");
      window.open(`/papers/${pmid}`, "_blank");
    }
  };

  const linkColor = (link: GraphLink) =>
    link.type === "paper-mech"
      ? "rgba(245,158,11,0.5)"
      : "rgba(16,185,129,0.5)";

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-1">Mechanism Knowledge Graph</h1>
      <p className="text-sm text-slate-500 mb-4">
        Papers ↔ Mechanisms ↔ Biomarkers — click a paper to open it.
      </p>

      {/* ✅ Contain canvas, prevent overflow */}
      <div className="h-[70vh] border rounded-md relative overflow-hidden bg-white dark:bg-slate-900">
        {loading ? (
          <div className="p-4 text-sm text-slate-500">Loading graph…</div>
        ) : (
          <ForceGraph2D
            graphData={data}
            nodeRelSize={4}
            cooldownTicks={60}
            linkColor={(l) => linkColor(l as GraphLink)}
            linkWidth={1}
            nodeCanvasObject={(node, ctx, scale) =>
              drawNode(node as GraphNode, ctx, scale)
            }
            onNodeClick={(node) => handleNodeClick(node as GraphNode)}
          />
        )}
      </div>
    </main>
  );
}
