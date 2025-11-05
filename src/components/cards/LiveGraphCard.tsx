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
  fx?: number;
  fy?: number;
  val?: number;
}

interface Link {
  source: string;
  target: string;
}

export default function LiveGraphCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  // scale settings
  const HUB_RADIUS = 300;
  const PAPER_RADIUS = 130;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const hubs = res.nodes.filter((n: Node) => n.type === "hub");
        const papers = res.nodes.filter((n: Node) => n.type === "paper");

        hubs.forEach((h: Node) => (h.val = 10));
        papers.forEach((p: Node) => (p.val = 2));

        setData({
          nodes: [...hubs, ...papers],
          links: res.links || [],
        });
      });
  }, []);

  // handle resize
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

  // fixed radial positions
  const positionNodes = () => {
    const hubs = data.nodes.filter((n) => n.type === "hub");
    const papers = data.nodes.filter((n) => n.type === "paper");

    hubs.forEach((hub, i) => {
      const angle = (i / hubs.length) * Math.PI * 2;
      hub.fx = Math.cos(angle) * HUB_RADIUS;
      hub.fy = Math.sin(angle) * HUB_RADIUS;

      const linked = papers.filter((p) =>
        data.links.some((l) => l.source === p.id && l.target === hub.id)
      );

      linked.forEach((p, j) => {
        const pa = (j / linked.length) * Math.PI * 2;
        p.fx = (hub.fx ?? 0) + Math.cos(pa) * PAPER_RADIUS;
        p.fy = (hub.fy ?? 0) + Math.sin(pa) * PAPER_RADIUS;
      });
    });
  };

  useEffect(() => {
    if (data.nodes.length > 0) {
      positionNodes();
      setTimeout(() => fgRef.current?.zoomToFit?.(400, 50), 400);
    }
  }, [data]);

  // draw nodes + labels
  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    const isHub = node.type === "hub";
    const radius = isHub ? 18 : 6;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? "#f59e0b" : "#2563eb";
    ctx.fill();

    const fadeZoom = 0.8; // paper labels fade below this zoom
    const showPaperLabel = globalScale < fadeZoom && !isHub;

    if (node.label && (isHub || showPaperLabel)) {
      const label =
        node.label.length > 26 ? node.label.slice(0, 26) + "…" : node.label;

      ctx.font = `${(isHub ? 16 : 11) / globalScale}px Inter, sans-serif`;
      ctx.fillStyle = "#1e293b";
      ctx.textAlign = "center";

      ctx.fillText(label, node.x, node.y - radius - 5);
    }
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        🧠 Live Mechanism Network
        <span className="text-xs text-gray-500">
          (radial, zoom intelligence)
        </span>
      </div>

      <div
        ref={containerRef}
        className="w-full h-[650px] rounded-lg overflow-hidden border border-gray-100"
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
            linkWidth={() => 1.1}
            linkOpacity={0.9}
            enableNodeDrag={false}
            minZoom={0.2}
            maxZoom={4}
            onNodeClick={(n: any) => {
              if (n.type === "paper") window.open(`/papers/${n.id}`, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
}
