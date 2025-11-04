"use client";

import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export default function LiveGraphCard() {
  return (
    <div className="border rounded-xl p-4 bg-white dark:bg-slate-900 h-[360px] flex flex-col">
      <div className="text-sm font-semibold mb-2">📡 Live Mechanism Graph</div>

      <div className="flex-1 border rounded overflow-hidden">
        <ForceGraph2D
          graphData={{ nodes: [], links: [] }}
          width={400}
          height={280}
        />
      </div>
    </div>
  );
}
