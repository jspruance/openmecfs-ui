"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface Node {
  id: string;
  label?: string;
  type?: "paper" | "mechanism" | "biomarker";
  x?: number;
  y?: number;
}
interface Link {
  source: string;
  target: string;
}

export default function LiveGraphCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });
  const [loading, setLoading] = useState(true);

  // ✅ Auto-resize
  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver(() => {
      setSize({
        w: ref.current!.clientWidth,
        h: ref.current!.clientHeight,
      });
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // ✅ Fetch live graph
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const graph = res?.data ?? res ?? {};
        const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
        const links = Array.isArray(graph.links) ? graph.links : [];

        // fallback demo if empty
        if (!nodes.length) {
          setData({
            nodes: [
              { id: "ME/CFS", type: "mechanism" },
              { id: "Immune dysfunction", type: "mechanism" },
              { id: "Mitochondria", type: "mechanism" },
              { id: "Study123", type: "paper" },
            ],
            links: [
              { source: "Study123", target: "Immune dysfunction" },
              { source: "Study123", target: "Mitochondria" },
            ],
          });
        } else {
          setData({ nodes, links });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Better node colors
  const nodeColors: Record<string, string> = {
    paper: "#2563eb",
    mechanism: "#f59e0b",
    biomarker: "#10b981",
  };

  const drawNode = (
    node: Node,
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const color = nodeColors[node.type ?? "paper"] ?? "#64748b";
    const size = 6;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x ?? 0, node.y ?? 0, size, 0, 2 * Math.PI);
    ctx.fill();

    const label = node.label ?? node.id;
    if (!label) return;
    const fontSize = 10 / scale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#111827";
    ctx.fillText(label, (node.x ?? 0) + size + 3, node.y ?? 0);
  };

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white dark:bg-slate-900 flex flex-col h-[360px]">
      <div className="text-sm font-semibold mb-2 flex items-center gap-1">
        📡 Live Mechanism Graph
      </div>

      {loading && (
        <div className="text-xs text-gray-500 mb-2">
          Building knowledge graph…
        </div>
      )}

      <div
        ref={ref}
        className="flex-1 rounded-lg bg-gray-50 dark:bg-slate-800 overflow-hidden"
      >
        {size.w > 0 && size.h > 0 && (
          <ForceGraph2D
            graphData={data}
            width={size.w}
            height={size.h}
            nodeRelSize={6}
            linkColor={() => "#94a3b8"}
            backgroundColor={"#ffffff"}
            cooldownTime={2000}
            nodeCanvasObject={(node, ctx, scale) =>
              drawNode(node as Node, ctx, scale)
            }
          />
        )}
      </div>
    </div>
  );
}
