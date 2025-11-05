/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamic import for force graph
const ForceGraph2D: any = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface Node {
  id: string;
  label?: string;
  title?: string;
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

  // ✅ Fetch + label fix
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const hubs = res.nodes.filter((n: Node) => n.type === "hub");
        const papers = res.nodes.filter((n: Node) => n.type === "paper");

        hubs.forEach((h: Node) => {
          h.val = 10;
          h.label = h.label || h.id;
        });

        papers.forEach((p: Node) => {
          p.val = 2;
          p.label = p.title
            ? p.title.length > 40
              ? p.title.slice(0, 38) + "…"
              : p.title
            : `PMID: ${p.id}`;
        });

        setData({
          nodes: [...hubs, ...papers],
          links: res.links || [],
        });

        setTimeout(() => {
          fgRef.current?.zoomToFit?.(800, 80);
        }, 600);
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

  // ✅ Custom draw
  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const isHub = node.type === "hub";
    const radius = isHub ? 22 : 8;

    const COLORS = {
      hub: "#f59e0b",
      paper: "#2563eb",
      text: "#1e293b",
    };

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
    ctx.fill();

    // ✅ Label
    const label = node.label || "";
    const fontSize = (isHub ? 18 : 10) / scale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = COLORS.text;
    ctx.fillText(label, node.x, node.y - radius - 4);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        🧠 Live Mechanism Network{" "}
        <span className="text-xs text-gray-500">
          (debug mode — showing all papers)
        </span>
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
            backgroundColor="#ffffff"
            nodeCanvasObject={drawNode}
            linkColor={() => "#CBD5E1"}
            linkWidth={() => 1.2}
            linkOpacity={0.8}
            nodeRelSize={4}
            warmupTicks={60}
            cooldownTicks={300}
            d3VelocityDecay={0.25}
            d3AlphaDecay={0.02}
            // ✅ Spread nodes apart — fix overlapping blob
            d3Force={(forceName: string, force: any) => {
              if (forceName === "charge") {
                force.strength(-300);
              }
              if (forceName === "collision") {
                force.radius((n: any) => (n.type === "hub" ? 60 : 20));
              }
            }}
            onNodeHover={(node: any) => {
              document.body.style.cursor = node ? "pointer" : "default";
            }}
            onNodeClick={(n: any) => {
              if (n.type === "paper") window.open(`/papers/${n.id}`, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
}
