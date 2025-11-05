/* eslint-disable @typescript-eslint/no-explicit-any */
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

// ✅ DEBUG MODE — show all papers or only connected ones
const DEBUG_MODE = true;

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
        let nodes: Node[] = res.nodes || [];
        let links: Link[] = res.links || [];

        if (!DEBUG_MODE) {
          const connectedPapers = new Set(
            links
              .filter((l) => l.type === "paper-mechanism")
              .map((l) => l.source)
          );

          nodes = nodes.filter(
            (n) => n.type === "hub" || connectedPapers.has(n.id)
          );
        }

        const finalNodes = nodes.map((n) => ({
          ...n,
          val: n.type === "hub" ? 6 : 1.4, // 🧠 emphasize hubs
        }));

        setData({ nodes: finalNodes, links });

        setTimeout(() => fgRef.current?.zoomToFit?.(800, 80), 800);
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
    const radius = isHub ? 20 : 8;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
    ctx.fill();

    if (node.label) {
      const fontSize = (isHub ? 18 : 12) / scale;
      const truncated =
        node.label.length > 22 ? node.label.slice(0, 22) + "…" : node.label;

      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.text;
      ctx.fillText(truncated, node.x, node.y + radius + 10);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        🧠 Live Mechanism Network{" "}
        {DEBUG_MODE && (
          <span className="text-xs text-gray-500">(debug — all papers)</span>
        )}
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
            nodeRelSize={6}
            backgroundColor="#ffffff"
            linkColor={() => "#CBD5E1"}
            linkOpacity={0.6}
            linkWidth={() => 1.2}
            cooldownTicks={160}
            d3VelocityDecay={0.33}
            d3Force="charge"
            d3AlphaDecay={0.015}
            nodeCanvasObject={(node, ctx, scale) =>
              drawNode(node as Node & { x: number; y: number }, ctx, scale)
            }
            onNodeHover={(n: any) =>
              (document.body.style.cursor = n ? "pointer" : "default")
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
