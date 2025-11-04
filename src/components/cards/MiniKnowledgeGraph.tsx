"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export default function MiniKnowledgeGraph() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph?limit=200`)
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm h-64">
      <h3 className="text-lg font-semibold mb-2">ME/CFS Knowledge Graph</h3>

      <div className="h-[80%]">
        <ForceGraph2D
          width={350}
          height={170}
          graphData={data}
          nodeRelSize={4}
          enableNodeDrag={false}
          zoom={false}
          pan={false}
        />
      </div>

      <a
        href="/research/graph"
        className="text-xs text-blue-600 mt-1 inline-block hover:underline"
      >
        Open full graph →
      </a>
    </div>
  );
}
