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
  val?: number;
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
        const nodes: Node[] = Array.isArray(res.nodes) ? res.nodes : [];
        const links: Link[] = Array.isArray(res.links) ? res.links : [];

        // ✅ Keep hubs + only papers connected to hubs
        const connectedPapers = new Set(
          links
            .filter((l: Link) => l.type === "paper-mechanism")
            .map((l: Link) => l.source)
        );

        const filteredNodes = nodes.filter(
          (n: Node) => n.type === "hub" || connectedPapers.has(n.id)
        );

        setData({
          nodes: filteredNodes.map((n) => ({
            ...n,
            val: n.type === "hub" ? 4 : 1, // hubs stronger repulsion
          })),
          links: links.filter((l: Link) => connectedPapers.has(l.source)),
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

    // Label
    if (node.label) {
      const fontSize = (isHub ? 16 : 11) / scale;
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.text;
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
        className="w-full h-[380px] rounded-lg overflow-hidden border"
      >
        {size.w > 0 && size.h > 0 && (
          <ForceGraph2D
            width={size.w}
            height={size.h}
            graphData={data}
            backgroundColor="#ffffff"
            nodeRelSize={3}
            linkColor={() => "#CBD5E1"}
            linkOpacity={0.55}
            linkWidth={() => 1}
            cooldownTicks={120}
            d3VelocityDecay={0.2}
            d3AlphaDecay={0.015}
            nodeCanvasObject={(node, ctx, scale) =>
              drawNode(node as Node & { x: number; y: number }, ctx, scale)
            }
            onEngineTick={() => {}}
            onNodeHover={(n) => {
              document.body.style.cursor = n ? "pointer" : "default";
            }}
            onNodeClick={(n) => {
              const node = n as Node;
              if (node.type === "paper") {
                window.open(`/papers/${node.id}`, "_blank");
              }
            }}
            // ✅ Global repulsion force
            d3Force={(fg) => {
              fg.d3Force("charge")?.strength((n: any) =>
                n.type === "hub" ? -250 : -30
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
