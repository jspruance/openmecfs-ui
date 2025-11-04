"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface Node {
  id: string;
  label?: string;
}

interface Link {
  source: string;
  target: string;
}

export default function LiveGraphCard() {
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        // Handle both shapes: {data: {nodes,links}} or {nodes,links}
        const graph = res?.data ?? res ?? { nodes: [], links: [] };

        setData({
          nodes: Array.isArray(graph.nodes) ? graph.nodes : [],
          links: Array.isArray(graph.links) ? graph.links : [],
        });
      })
      .catch(() => {
        setData({ nodes: [], links: [] });
      })
      .finally(() => setLoading(false));
  }, []);

  const drawNode = (
    node: Node & { x?: number; y?: number },
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const size = 6;
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(node.x ?? 0, node.y ?? 0, size, 0, 2 * Math.PI);
    ctx.fill();

    if (node.label || node.id) {
      const fontSize = 10 / scale;
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#111827";
      ctx.fillText(node.label || node.id, (node.x ?? 0) + size + 3, node.y ?? 0);
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-white dark:bg-slate-900 h-[360px] flex flex-col">
      <div className="text-sm font-semibold mb-2">📡 Live Mechanism Graph</div>

      {loading && (
        <div className="text-xs text-gray-500 mb-2">Loading network...</div>
      )}

      <div className="flex-1 border rounded overflow-hidden">
        <ForceGraph2D
          graphData={data}
          width={400}
          height={280}
          nodeRelSize={6}
          backgroundColor={"#ffffff"}
          nodeCanvasObject={(node, ctx, scale) =>
            drawNode(node as Node & { x?: number; y?: number }, ctx, scale)
          }
        />
      </div>
    </div>
  );
}
