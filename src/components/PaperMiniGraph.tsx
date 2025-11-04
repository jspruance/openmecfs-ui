"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// ✅ Load ONLY the 2D bundle
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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/paper/${pmid}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d) => setData(d?.nodes?.length ? d : { nodes: [], links: [] }))
      .catch(() => setData({ nodes: [], links: [] }));
  }, [pmid]);

  const isEmpty = data.nodes.length <= 1;

  if (isEmpty) {
    return (
      <div className="mt-6 rounded border bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-3 py-2 text-xs text-slate-500 border-b">
          Mechanisms & Biomarkers Network
        </div>
        <div className="h-40 flex items-center justify-center text-xs text-slate-400 text-center">
          🧠 Mechanistic network coming soon
        </div>
      </div>
    );
  }

  const drawNode = (node: GraphNode, ctx: CanvasRenderingContext2D) => {
    const size = node.type === "paper" ? 10 : 6;
    const color =
      node.type === "paper"
        ? "#2563eb"
        : node.type === "mechanism"
        ? "#f59e0b"
        : "#10b981";

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x ?? 0, node.y ?? 0, size, 0, 2 * Math.PI);
    ctx.fill();
  };

  return (
    <div className="mt-6 rounded border bg-white dark:bg-slate-900 overflow-hidden">
      <div className="px-3 py-2 text-xs text-slate-500 border-b">
        Mechanisms & Biomarkers Network
      </div>
      <div className="h-64 w-full">
        <ForceGraph2D
          graphData={data}
          nodeRelSize={4}
          cooldownTicks={30}
          // linkColor={() => "rgba(148,163,184,0.4)"}
          // linkWidth={() => 1}
          // enablePanInteraction={false}
          // enableZoomInteraction={false}
          nodeCanvasObject={(node, ctx) => drawNode(node as GraphNode, ctx)}
        />
      </div>
    </div>
  );
}
