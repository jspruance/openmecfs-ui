/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as d3 from "d3-force";

// Dynamic import of force-graph (client only)
const ForceGraph2D: any = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface Node {
  id: string;
  label?: string; // ✅ human label (mechanism or paper summary)
  fullLabel?: string; // ✅ full title for tooltip
  type: "hub" | "paper";
  x?: number;
  y?: number;
  val?: number;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

export default function LiveGraphCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  // ✅ Load graph data
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const nodes: Node[] = res.nodes || [];
        const links: Link[] = res.links || [];

        // ✅ enhance paper nodes with one-sentence mechanism summary
        const enhancedNodes = nodes.map((n: Node) => ({
          ...n,
          // Hub label stays; paper label becomes one-sentence summary
          label:
            n.type === "hub"
              ? n.label
              : res.paperSummaries?.[n.id]?.one_sentence ?? "(summary pending)",
          fullLabel: res.paperSummaries?.[n.id]?.title ?? "Unknown title",
          val: n.type === "hub" ? 8 : 2, // mass
        }));

        // ✅ Filter: hubs + papers linked to hubs
        const connectedPapers = new Set(
          links.filter((l) => l.type === "paper-mechanism").map((l) => l.source)
        );

        const filteredNodes = enhancedNodes.filter(
          (n) => n.type === "hub" || connectedPapers.has(n.id)
        );

        setData({ nodes: filteredNodes, links });

        // ✅ auto-fit view
        setTimeout(() => fgRef.current?.zoomToFit?.(800, 120), 800);
      });
  }, []);

  // ✅ Track container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(() => {
      setSize({
        w: containerRef.current!.clientWidth,
        h: containerRef.current!.clientHeight,
      });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // ✅ Space out papers around hubs
  useEffect(() => {
    if (!fgRef.current) return;
    fgRef.current.d3Force(
      "collision",
      d3.forceCollide((n: Node) => (n.type === "hub" ? 32 : 18))
    );
    fgRef.current.d3Force("charge", d3.forceManyBody().strength(-90));
  }, [data]);

  // ✅ Draw Node
  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const isHub = node.type === "hub";
    const radius = isHub ? 16 : 8;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? "#f59e0b" : "#2563eb";
    ctx.fill();

    if (node.label) {
      const fontSize = (isHub ? 15 : 11) / scale;
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1e293b";

      ctx.fillText(node.label, node.x + radius + 4, node.y);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        🧠 Live Mechanism Network
      </div>

      <div
        ref={containerRef}
        className="w-full h-[380px] rounded-lg overflow-hidden border border-gray-100"
      >
        {size.w > 0 && size.h > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={size.w}
            height={size.h}
            graphData={data}
            nodeRelSize={4}
            backgroundColor="#ffffff"
            linkColor={() => "#CBD5E1"}
            linkOpacity={0.7}
            linkWidth={() => 1.2}
            cooldownTicks={120}
            d3VelocityDecay={0.35}
            nodeCanvasObject={(node, ctx, scale) =>
              drawNode(node as Node & { x: number; y: number }, ctx, scale)
            }
            onNodeHover={(n: any) => {
              document.body.style.cursor = n ? "pointer" : "default";
              if (n && n.fullLabel) {
                // tooltip
                const tip = document.getElementById("fg-tip");
                if (tip) {
                  tip.style.display = "block";
                  tip.innerHTML = n.fullLabel;
                }
              }
            }}
            onNodeClick={(n: any) => {
              if (n.type === "paper") {
                window.open(`/papers/${n.id}`, "_blank");
              }
            }}
          />
        )}
        <div
          id="fg-tip"
          className="absolute bg-white text-xs border rounded px-2 py-1 shadow"
          style={{ display: "none", pointerEvents: "none" }}
        />
      </div>
    </div>
  );
}
