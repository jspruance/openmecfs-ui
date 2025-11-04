"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface NodeObj {
  id: string;
  label?: string;
  x?: number;
  y?: number;
}

interface LinkObj {
  source: string;
  target: string;
}

interface GraphData {
  nodes: NodeObj[];
  links: LinkObj[];
}

export default function MiniKnowledgeGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph?limit=120`)
      .then((r) => r.json())
      .then((d: GraphData) => setData(d))
      .catch(() => setData({ nodes: [], links: [] }));
  }, []);

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

  return (
    <div
      ref={ref}
      className="border rounded-lg bg-white dark:bg-slate-900 h-[260px]"
    >
      {size.w > 0 && size.h > 0 && (
        <ForceGraph2D
          width={size.w}
          height={size.h}
          graphData={data}
          nodeRelSize={4}
          cooldownTicks={20}
          nodeCanvasObject={(node, ctx) => {
            const n = node as NodeObj;
            ctx.fillStyle = "#2563eb";
            ctx.beginPath();
            ctx.arc(n.x ?? 0, n.y ?? 0, 5, 0, 2 * Math.PI);
            ctx.fill();
          }}
        />
      )}
    </div>
  );
}
