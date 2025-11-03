"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((m) => m.ForceGraph2D),
  { ssr: false }
);

type Node = {
  id: string;
  label: string;
  type: "paper" | "mechanism" | "biomarker";
  size?: number;
};
type Link = { source: string; target: string; type: string };

export default function PaperMiniGraph({ pmid }: { pmid: string }) {
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/graph/paper/${pmid}`;
    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);
  }, [pmid]);

  if (!data.nodes.length) return null;

  const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D) => {
    const n = node as Node;
    const size = n.type === "paper" ? 8 : 5;
    const colors = {
      paper: "#2563eb",
      mechanism: "#f59e0b",
      biomarker: "#10b981",
    };

    ctx.fillStyle = colors[n.type] || "#64748b";
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.fill();
  };

  return (
    <div className="mt-6 rounded border">
      <div className="px-3 py-2 text-xs text-slate-500 border-b">
        Mechanisms & Biomarkers (mini graph)
      </div>
      <div className="h-64">
        <ForceGraph2D
          graphData={data}
          nodeRelSize={4}
          cooldownTicks={40}
          nodeCanvasObject={nodeCanvasObject}
        />
      </div>
    </div>
  );
}
