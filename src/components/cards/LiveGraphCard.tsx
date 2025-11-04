"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface Node {
  id: string;
  label?: string;
  title?: string;
  confidence?: number;
  type: "hub" | "paper";
  x?: number;
  y?: number;
  val?: number; // force strength
}

interface Link {
  source: string;
  target: string;
  type: string;
}

export default function LiveGraphCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const nodes = Array.isArray(res.nodes) ? res.nodes : [];
        const links = Array.isArray(res.links) ? res.links : [];

        // ✅ FILTER orphan papers (only show papers connected to hubs)
        const connectedPapers = new Set(
          links.filter((l: Link) => l.type === "paper-mechanism").map((l: Link) => l.source)
        );

        const filteredNodes = nodes.filter(
          (n) => n.type === "hub" || connectedPapers.has(n.id)
        );

        setData({
          nodes: filteredNodes.map((n) => ({
            ...n,
            val: n.type === "hub" ? 3 : 1,
          })),
          links,
        });
      });
  }, []);

  // Track container size
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

  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const isHub = node.type === "hub";
    const radius = isHub ? 13 : 7;

    const COLORS = {
      hub: "#f59e0b",
      paper: "#2563eb",
      text: "#1e293b",
    };

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
    ctx.fill();

    // ✅ Draw label
    const label = node.label;
    if (label) {
      const fontSize = (isHub ? 15 : 11) / scale;
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.text;
      ctx.fillText(label, node.x + radius + 4, node.y);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        🧠 Live Mechanism Network
      </div>

      <div
        ref={containerRef}
        className="w-full h-[380px] rounded-lg overflow-hidden border"
      >
        {size.w > 0 && size.h > 0 && (
          <ForceGraph2D
            width={size.w}
            height={size.h}
            graphData={data}
            nodeRelSize={4}
            linkColor={() => "#CBD5E1"}
            linkOpacity={0.7}
            linkWidth={() => 1.2}
            backgroundColor="#ffffff"
            cooldownTicks={80}
            d3Force="charge"
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.4}
            nodeCanvasObject={(node, ctx, scale) =>
              drawNode(node as Node & { x: number; y: number }, ctx, scale)
            }
            onNodeHover={(n) => {
              if (!n) {
                document.body.style.cursor = "default";
                return;
              }
              document.body.style.cursor = "pointer";
            }}
            onNodeClick={(n) => {
              const node = n as Node;
              if (node.type === "paper") {
                window.open(`/papers/${node.id}`, "_blank");
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
