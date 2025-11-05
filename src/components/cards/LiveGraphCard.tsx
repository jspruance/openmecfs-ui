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
  x?: number;
  y?: number;
  val?: number;
  fx?: number;
  fy?: number;
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

  // ✅ Fetch & prepare graph
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const hubs: Node[] = res.nodes.filter((n: Node) => n.type === "hub");
        const papers: Node[] = res.nodes.filter(
          (n: Node) => n.type === "paper"
        );

        hubs.forEach((h: Node) => (h.val = 8));
        papers.forEach((p: Node) => (p.val = 2));

        // ✅ Make sure humans see readable text — not PMID
        res.nodes.forEach((n: Node) => {
          if (n.type === "hub") n.label = n.label || n.title || n.id;
          if (n.type === "paper") n.label = n.title || n.label || n.id;
        });

        setData({
          nodes: [...hubs, ...papers],
          links: res.links || [],
        });

        // ✅ After data loads, zoom to fit
        setTimeout(() => {
          fgRef.current?.zoomToFit(800, 100);
        }, 300);
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

  // ✅ Radial hub + orbiting papers layout
  const positionNodes = () => {
    const hubs = data.nodes.filter((n) => n.type === "hub");
    const papers = data.nodes.filter((n) => n.type === "paper");

    const hubRadius = 180;
    const paperRadius = 100;

    hubs.forEach((hub, i) => {
      const angle = (i / hubs.length) * Math.PI * 2;
      hub.fx = Math.cos(angle) * hubRadius;
      hub.fy = Math.sin(angle) * hubRadius;

      // ✅ Match papers to hub (both link directions)
      const hubPapers = papers.filter((p) =>
        data.links.some(
          (l) =>
            (l.source === hub.id && l.target === p.id) ||
            (l.target === hub.id && l.source === p.id)
        )
      );

      hubPapers.forEach((p, j) => {
        const pa = (j / hubPapers.length) * Math.PI * 2;
        const hx = hub.fx ?? 0;
        const hy = hub.fy ?? 0;

        p.fx = hx + Math.cos(pa) * paperRadius;
        p.fy = hy + Math.sin(pa) * paperRadius;
      });
    });
  };

  useEffect(() => {
    if (data.nodes.length > 0) positionNodes();
  }, [data]);

  // ✅ Draw nodes
  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
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

    if (node.label) {
      const label =
        node.type === "hub"
          ? node.label
          : node.label.length > 26
          ? node.label.slice(0, 24) + "…"
          : node.label;

      const fontSize = (isHub ? 18 : 11) / scale;
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.text;
      ctx.fillText(label, node.x, node.y - radius - 5);
    }
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-3 flex items-center gap-2">
        🧠 Live Mechanism Network{" "}
        <span className="text-xs text-gray-500">(stable radial layout)</span>
      </div>

      <div
        ref={containerRef}
        className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-100"
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
            linkWidth={() => 1.4}
            linkOpacity={0.9}
            enableNodeDrag={false}
            cooldownTicks={0}
            onNodeClick={(n: any) => {
              if (n.type === "paper") window.open(`/papers/${n.id}`, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
}
