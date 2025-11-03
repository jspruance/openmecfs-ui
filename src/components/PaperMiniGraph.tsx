"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/paper/${pmid}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d: GraphData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pmid]);

  const drawNode = (
    node: GraphNode,
    ctx: CanvasRenderingContext2D,
    _scale: number
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
    <div className="mt-8 rounded-lg border bg-white dark:bg-slate-900">
      <div className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 border-b">
        Mechanisms & Biomarkers Network
      </div>

      <div
        className="relative w-full"
        style={{ height: "240px" }} // ✅ fixed height for mini graph
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
            Building graph…
          </div>
        )}

        {!loading && data.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
            No mechanistic links yet.
          </div>
        )}

        {data.nodes.length > 0 && (
          <ForceGraph2D
            graphData={data}
            nodeRelSize={4}
            cooldownTicks={40}
            linkColor={() => "rgba(148,163,184,0.4)"}
            linkWidth={1}
            nodeCanvasObject={(node, ctx, scale) =>
              drawNode(node as GraphNode, ctx, scale)
            }
          />
        )}
      </div>
    </div>
  );
}
