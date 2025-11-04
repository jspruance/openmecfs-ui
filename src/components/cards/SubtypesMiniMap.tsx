"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface NodeObj {
  id: string;
  label?: string;
  group?: string | number;
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

export default function SubtypesMiniMap() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/subtypes/map?limit=150`)
      .then((r) => r.json())
      .then((d: GraphData) => setData(d))
      .catch(() => setData({ nodes: [], links: [] }));
  }, []);

  return (
    <div className="border rounded-lg p-3 bg-white dark:bg-slate-900 h-[240px]">
      <div className="text-xs font-medium text-slate-500 mb-2">Subtype Map</div>
      <div className="w-full h-[200px]">
        <ForceGraph2D
          graphData={data}
          nodeRelSize={3}
          nodeCanvasObject={(node: NodeObj, ctx) => {
            ctx.fillStyle = "#6366f1";
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, 4, 0, 2 * Math.PI);
            ctx.fill();
          }}
        />
      </div>
    </div>
  );
}
