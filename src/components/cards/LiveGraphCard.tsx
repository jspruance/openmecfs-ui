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
  title?: string;
  type: "hub" | "paper";
  val?: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
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

  // ✅ Fetch + size assignment
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const nodes = res.nodes.map((n: Node) => ({
          ...n,
          val: n.type === "hub" ? 12 : 3,
        }));

        setData({ nodes, links: res.links });

        // ✅ Run physics then freeze nodes
        setTimeout(() => {
          const graph = fgRef.current;
          if (!graph) return;

          graph.d3AlphaDecay(0.3);
          graph.d3VelocityDecay(0.4);

          setTimeout(() => {
            // ✅ Freeze layout
            data.nodes.forEach((n) => {
              n.fx = n.x;
              n.fy = n.y;
            });

            graph.d3AlphaTarget(0);
            graph.d3Stop();

            // ✅ Center & zoom to fit
            graph.zoomToFit(800, 60);
          }, 1600);
        }, 200);
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

  // ✅ Draw nodes — clear + readable
  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: any,
    scale: number
  ) => {
    const isHub = node.type === "hub";
    const radius = isHub ? 18 : 7;

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
      let label = node.label;
      if (!isHub) {
        label =
          node.label.length > 26 ? node.label.slice(0, 24) + "…" : node.label;
      }
      const fontSize = (isHub ? 18 : 12) / Math.sqrt(scale);
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.text;
      ctx.fillText(label, node.x, node.y - radius - (isHub ? 6 : 3));
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        🧠 Live Mechanism Network{" "}
        <span className="text-xs text-gray-500">
          (settles into stable layout)
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
            linkWidth={1}
            linkOpacity={0.9}
            nodeRelSize={4}
            cooldownTicks={80}
            d3Force="charge"
            onNodeHover={(node: any) => {
              document.body.style.cursor = node ? "pointer" : "default";
            }}
            onNodeClick={(n: Node) => {
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
