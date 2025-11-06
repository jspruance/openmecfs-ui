"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export default function BiomarkerGraph() {
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/biomarkers/graph`)
      .then((res) => res.json())
      .then(setGraphData)
      .catch((err) => console.error("Failed to load biomarker graph:", err));
  }, []);

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 mt-8">
      <h2 className="text-lg font-semibold mb-2">
        Biomarker–Mechanism Network
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        Visualizing relationships between biomarkers and biological mechanisms
        reported in ME/CFS research.
      </p>
      <div className="w-full h-[600px]">
        <ForceGraph2D
          graphData={graphData}
          nodeAutoColorBy="type"
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle =
              node.color || (node.type === "mechanism" ? "#2563eb" : "#16a34a");
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, node.val || 3, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.fillText(label, node.x! + 8, node.y! + 3);
          }}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.004}
          linkColor={() => "rgba(0,0,0,0.2)"}
          backgroundColor="#fafafa"
        />
      </div>
    </div>
  );
}
