/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D: any = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface GraphData {
  nodes: { id: string; type: string; val?: number; x?: number; y?: number }[];
  links: { source: string; target: string }[];
}

export default function BiomarkerGraphCard() {
  const [graph, setGraph] = useState<GraphData>({ nodes: [], links: [] });
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [width, setWidth] = useState(800);
  const [error, setError] = useState<string | null>(null);

  // Responsive width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch biomarker graph data
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/biomarkers/graph`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to load biomarker graph (${res.status})`);
        return res.json();
      })
      .then((json) => setGraph(json))
      .catch((err) => setError(err.message));
  }, []);

  // ✅ Adjusted bounding box before zoomToFit (prevents clipping)
  useEffect(() => {
    if (!fgRef.current || graph.nodes.length === 0) return;

    const fg = fgRef.current;

    const timer = setTimeout(() => {
      // Compute bounding box manually
      const xs = graph.nodes.map((n) => n.x ?? 0);
      const ys = graph.nodes.map((n) => n.y ?? 0);
      if (xs.length === 0 || ys.length === 0) return;

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      // Add asymmetric padding (more space on bottom and right)
      const padX = (maxX - minX) * 0.05; // 5% horizontally
      const padYTop = (maxY - minY) * 0.05; // small top
      const padYBottom = (maxY - minY) * 0.25; // extra bottom padding

      // Apply virtual bounding box
      fg.zoomToFit(1000, 0, {
        x: (minX + maxX) / 2,
        y: (minY + maxY + padYBottom / 2 - padYTop / 2) / 2,
        z: 1,
      });

      // force re-fit with padding values
      fg.cameraPosition(
        { x: (minX + maxX) / 2, y: (minY + maxY) / 2, z: 100 },
        undefined,
        1000
      );
    }, 1400);

    return () => clearTimeout(timer);
  }, [graph]);

  return (
    <div className="border border-slate-200 rounded-xl shadow-sm bg-white p-5 mt-4 mb-10 overflow-hidden">
      <h2 className="text-xl font-semibold mb-1">
        Biomarker–Mechanism Network
      </h2>
      <p className="text-sm text-slate-600 mb-3">
        Visualizing relationships between biomarkers and biological mechanisms
        reported in ME/CFS research.
      </p>

      {error && (
        <p className="text-red-600 text-sm">Error loading graph: {error}</p>
      )}

      <div
        ref={containerRef}
        className="w-full h-[480px] overflow-hidden rounded-md"
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={graph as any}
          nodeAutoColorBy="type"
          linkColor={() => "rgba(0,0,0,0.2)"}
          backgroundColor="#fafafa"
          width={width}
          nodeRelSize={9}
          cooldownTicks={60}
          d3VelocityDecay={0.25}
          d3AlphaDecay={0.04}
          nodeCanvasObject={(
            node: any,
            ctx: CanvasRenderingContext2D,
            globalScale: number
          ) => {
            const label = node.id;
            const fontSize = 14 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = node.type === "mechanism" ? "#2563eb" : "#16a34a";
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, node.val ?? 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.fillText(label, (node.x ?? 0) + 8, (node.y ?? 0) + 3);
          }}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.004}
        />
      </div>
    </div>
  );
}
