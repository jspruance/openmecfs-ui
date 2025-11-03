"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((m) => m.ForceGraph2D),
  { ssr: false }
);

type Node = {
  id: string;
  label: string;
  type: "paper" | "mechanism" | "biomarker";
  size?: number;
  meta?: any;
};
type Link = { source: string; target: string; type: string };

export default function GraphPage() {
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/graph?limit=300`;
    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const nodeCanvasObject = (
    node: any,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    const n = node as Node;
    const size = Math.max(4, Math.min(18, (n.size || 1) * 2));
    const colors = {
      paper: "#2563eb", // blue
      mechanism: "#f59e0b", // amber
      biomarker: "#10b981", // emerald
    };
    ctx.fillStyle = colors[n.type] || "#64748b";
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.fill();

    const label = n.label;
    if (!label) return;

    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#111827";
    ctx.fillText(label, node.x + size + 2, node.y);
  };

  const linkColor = (l: any) =>
    l.type === "paper-mech" ? "#f59e0b66" : "#10b98166";

  const handleNodeClick = (n: any) => {
    const node = n as Node;
    if (node.type === "paper") {
      const pmid = node.id.replace("paper:", "");
      window.open(`/papers/${pmid}`, "_blank");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Mechanism Knowledge Graph</h1>
      <p className="text-sm text-slate-500 mb-4">
        Papers ↔ Mechanisms ↔ Biomarkers (latest summaries). Click a paper node
        to open its page.
      </p>

      <div className="h-[70vh] rounded border">
        {!loading && (
          <ForceGraph2D
            graphData={data}
            nodeRelSize={4}
            cooldownTicks={60}
            linkColor={linkColor as any}
            linkDirectionalParticles={0}
            nodeCanvasObject={nodeCanvasObject}
            onNodeClick={handleNodeClick}
          />
        )}
        {loading && (
          <div className="p-4 text-sm text-slate-500">Loading graph…</div>
        )}
      </div>
    </main>
  );
}
