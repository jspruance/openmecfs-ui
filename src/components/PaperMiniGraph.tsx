"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface GraphNode {
  id: string;
  label: string;
  type: "paper" | "mechanism" | "biomarker";
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export default function PaperMiniGraph({ pmid }: { pmid: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });

  // ✅ Resize observer
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

  // ✅ Fetch paper graph data
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/paper/${pmid}`)
      .then((r) => r.json())
      .then((d) => setData(d ?? { nodes: [], links: [] }));
  }, [pmid]);

  // ✅ Draw node + label
  const drawNode = (
    node: GraphNode,
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const size = node.type === "paper" ? 8 : 5;
    const colors: Record<GraphNode["type"], string> = {
      paper: "#2563eb",
      mechanism: "#f59e0b",
      biomarker: "#10b981",
    };

    // circle
    ctx.fillStyle = colors[node.type];
    ctx.beginPath();
    ctx.arc(node.x ?? 0, node.y ?? 0, size, 0, 2 * Math.PI);
    ctx.fill();

    // text
    const fontSize = 11 / scale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = "#334155";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, (node.x ?? 0) + size + 4, node.y ?? 0);
  };

  return (
    <div
      ref={ref}
      className="w-full h-60 border rounded bg-white dark:bg-slate-900 overflow-hidden relative"
    >
      {size.w > 0 && size.h > 0 && (
        <ForceGraph2D
          width={size.w}
          height={size.h}
          graphData={data}
          nodeRelSize={4}
          cooldownTicks={20}
          // ❌ Remove nodeLabel prop — manual labels are used instead
          nodeCanvasObject={(node, ctx, scale) =>
            drawNode(node as GraphNode, ctx, scale)
          }
        />
      )}
    </div>
  );
}
