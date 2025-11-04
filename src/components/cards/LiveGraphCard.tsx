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

export default function LiveGraphCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  // ✅ Debug mode: show all nodes (will add toggle later)
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const nodes: Node[] = res.nodes || [];
        const links: Link[] = res.links || [];

        const finalNodes = nodes.map((n: Node) => ({
          ...n,
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

  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const isHub = node.type === "hub";
    const radius = isHub ? 14 : 6;

    const COLORS = {
      hub: "#f59e0b",
      paper: "#2563eb",
      text: "#1e293b",
    };

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
    ctx.fill();

    if (node.label) {
      const fontSize = (isHub ? 15 : 11) / scale;
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
        <span className="text-xs font-normal text-gray-500">
          (debug mode — showing all papers)
        </span>
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
            nodeCanvasObject={(
              node: Node & { x: number; y: number },
              ctx: CanvasRenderingContext2D,
              scale: number
            ) => drawNode(node, ctx, scale)}
            onNodeHover={(n: Node | null) => {
              document.body.style.cursor = n ? "pointer" : "default";
            }}
            onNodeClick={(n: Node) => {
              if (n.type === "paper") window.open(`/papers/${n.id}`, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
}
