"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((m) => m.ForceGraph2D),
  { ssr: false }
);

interface GraphNode {
  id: string;
  label: string;
  type: "paper" | "mechanism" | "biomarker";
  size?: number;
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

export default function PaperMiniGraph({ pmid }: { pmid: string }) {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/paper/${pmid}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d: GraphData) => setData(d));
  }, [pmid]);

  if (!data.nodes.length) return null;

  const drawNode = (
    node: GraphNode,
    ctx: CanvasRenderingContext2D,
    _globalScale: number
  ) => {
    const size = node.type === "paper" ? 8 : 5;

    const colors = {
      paper: "#2563eb",
      mechanism: "#f59e0b",
      biomarker: "#10b981",
    };

    ctx.fillStyle = colors[node.type] || "#64748b";
    ctx.beginPath();
    ctx.arc(node.x ?? 0, node.y ?? 0, size, 0, 2 * Math.PI);
    ctx.fill();
  };

  return (
    <div className="mt-6 rounded border">
      <div className="px-3 py-2 text-xs text-slate-500 border-b">
        Mechanisms & Biomarkers
      </div>
      <div className="h-64">
        <ForceGraph2D
          graphData={data}
          nodeRelSize={4}
          cooldownTicks={40}
          nodeCanvasObject={(node, ctx, scale) =>
            drawNode(node as GraphNode, ctx, scale)
          }
        />
      </div>
    </div>
  );
}
