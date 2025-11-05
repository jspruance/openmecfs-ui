/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D: any = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface Node {
  id: string;
  label?: string;
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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const nodes: Node[] = res.nodes || [];
        const links: Link[] = res.links || [];

        const finalNodes = nodes.map((n: Node) => ({
          ...n,
          // Hubs large, papers smaller
          val: n.type === "hub" ? 4 : 1.2,
        }));

        setData({ nodes: finalNodes, links });

        setTimeout(() => {
          try {
            fgRef.current?.zoomToFit?.(600, 80);
          } catch {}
        }, 800);
      });
  }, []);

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

  const COLORS = {
    hub: "#f59e0b",
    paper: "#2563eb",
    text: "#1e293b",
  };

  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const isHub = node.type === "hub";
    const radius = isHub ? 14 : 7;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
    ctx.fill();

    if (node.label) {
      const fontSize = (isHub ? 15 : 11) / scale;
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = isHub ? "center" : "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.text;

      // Truncate long titles
      const label =
        node.label.length > 24 ? node.label.slice(0, 24) + "…" : node.label;

      ctx.fillText(label, node.x + (isHub ? 0 : radius + 4), node.y);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        🧠 Live Mechanism Network{" "}
        <span className="text-xs text-gray-500">(debug mode — all papers)</span>
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
            linkWidth={() => 1.1}
            cooldownTicks={120}
            d3VelocityDecay={0.35}
            nodeCanvasObject={(node, ctx, scale) =>
              drawNode(node as Node & { x: number; y: number }, ctx, scale)
            }
            onNodeHover={(n: any) => {
              document.body.style.cursor = n ? "pointer" : "default";
            }}
            onNodeClick={(n: any) => {
              if (n.type === "paper") {
                window.open(`/papers/${n.id}`, "_blank");
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
