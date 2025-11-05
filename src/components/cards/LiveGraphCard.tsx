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
  x?: number;
  y?: number;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

const HUB_ORDER = [
  "hub:neuroinflammation",
  "hub:viral",
  "hub:immune",
  "hub:mitochondrial",
  "hub:vascular",
  "hub:autonomic",
];

export default function LiveGraphCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  // --------------------------
  // Load & prepare data
  // --------------------------
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const hubs = res.nodes.filter((n: Node) => n.type === "hub");
        const papers = res.nodes.filter((n: Node) => n.type === "paper");

        // Keep only our known hubs, in fixed order
        const orderedHubs = HUB_ORDER.map((id) =>
          hubs.find((h: Node) => h.id === id)
        ).filter(Boolean) as Node[];

        // Only include papers that have a valid hub link
        const filteredPapers = papers.filter((p: Node) =>
          res.links.some(
            (l: Link) => l.source === p.id && HUB_ORDER.includes(l.target)
          )
        );

        const filteredLinks = res.links.filter(
          (l: Link) =>
            HUB_ORDER.includes(l.target) &&
            filteredPapers.some((p: Node) => p.id === l.source)
        );

        setData({
          nodes: [...orderedHubs, ...filteredPapers],
          links: filteredLinks,
        });
      });
  }, []);

  // --------------------------
  // Fix node positions (radial)
  // --------------------------
  useEffect(() => {
    if (!data.nodes.length) return;

    const hubs = data.nodes.filter((n) => n.type === "hub");
    const papers = data.nodes.filter((n) => n.type === "paper");

    const hubRadius = 200;
    const paperRadius = 90;

    hubs.forEach((hub, i) => {
      const angle = (i / hubs.length) * Math.PI * 2;
      hub.fx = Math.cos(angle) * hubRadius;
      hub.fy = Math.sin(angle) * hubRadius;

      const hubPapers = papers.filter((p) =>
        data.links.some((l) => l.source === p.id && l.target === hub.id)
      );

      hubPapers.forEach((p, j) => {
        const pa = (j / hubPapers.length) * Math.PI * 2;
        p.fx = hub.fx! + Math.cos(pa) * paperRadius;
        p.fy = hub.fy! + Math.sin(pa) * paperRadius;
      });
    });
  }, [data]);

  // --------------------------
  // Resize container
  // --------------------------
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

  // --------------------------
  // Draw nodes + labels
  // --------------------------
  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const isHub = node.type === "hub";
    const radius = isHub ? 18 : 6;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? "#f59e0b" : "#2563eb";
    ctx.fill();

    // Labels
    let label = node.label || "";

    if (node.type === "paper") {
      label = node.title
        ? node.title.slice(0, 32) + (node.title.length > 32 ? "…" : "")
        : node.label!;
    }

    const fontSize = (isHub ? 18 : 11) / scale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    ctx.fillText(label, node.x, node.y - radius - 4);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        🧠 Live Mechanism Network{" "}
        <span className="text-xs text-gray-500">(stable radial layout)</span>
      </div>

      <div
        ref={containerRef}
        className="w-full h-[620px] rounded-lg overflow-hidden border border-gray-100"
      >
        {size.w > 0 && size.h > 0 && (
          <ForceGraph2D
            width={size.w}
            height={size.h}
            graphData={data}
            backgroundColor="#ffffff"
            nodeCanvasObject={drawNode}
            linkColor={() => "#cbd5e1"}
            linkWidth={() => 1.2}
            linkOpacity={0.9}
            enableNodeDrag={false}
            zoomToFit={false}
            onNodeClick={(n: any) => {
              if (n.type === "paper") window.open(`/papers/${n.id}`, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
}
