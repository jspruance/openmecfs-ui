/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D: any = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface Node {
  id: string;
  label?: string; // ✅ human-readable label from backend
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

  // ✅ Debug mode: show ALL nodes, all links
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const nodes: Node[] =
          res.nodes?.map((n: any) => ({
            ...n,
            // ✅ Bigger hubs
            val: n.type === "hub" ? 6 : 2.2,
          })) || [];

        const links = res.links || [];
        setData({ nodes, links });

        // ✅ Zoom out so nodes don’t overlap
        setTimeout(() => {
          try {
            fgRef.current?.zoomToFit?.(800, 80);
          } catch {}
        }, 500);
      });
  }, []);

  // ✅ Resize observer
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

  // ✅ Custom draw for clear labeling
  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const isHub = node.type === "hub";
    const radius = isHub ? 22 : 10;

    const COLORS = {
      hub: "#f59e0b",
      paper: "#2563eb",
      text: "#1e293b",
    };

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
    ctx.fill();

    const label = node.label || node.id;
    const fontSize = (isHub ? 18 : 12) / scale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = Colors.text;

    // ✅ Truncate long paper titles
    const truncated = label.length > 22 ? label.slice(0, 22) + "…" : label;
    ctx.fillText(truncated, node.x, node.y + radius + fontSize);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        🧠 Live Mechanism Network{" "}
        <span className="text-xs text-gray-500">(debug mode — all papers)</span>
      </div>

      <div
        ref={containerRef}
        className="w-full h-[420px] rounded-lg overflow-hidden border border-gray-100"
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
            linkOpacity={0.8}
            linkWidth={() => 1.2}
            cooldownTicks={150}
            d3VelocityDecay={0.35}
            onNodeHover={(n: any) =>
              (document.body.style.cursor = n ? "pointer" : "default")
            }
            nodeCanvasObject={(node, ctx, scale) =>
              drawNode(node as Node & { x: number; y: number }, ctx, scale)
            }
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
