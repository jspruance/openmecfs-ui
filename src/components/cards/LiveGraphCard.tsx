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

        // Ensure links connect papers to hubs properly
        const validLinks = (res.links || []).filter((link: Link) => {
          const sourceIsHub = hubs.some((h: Node) => h.id === link.source);
          const targetIsHub = hubs.some((h: Node) => h.id === link.target);
          const sourceIsPaper = papers.some((p: Node) => p.id === link.source);
          const targetIsPaper = papers.some((p: Node) => p.id === link.target);
          // Keep links that connect hub-to-paper or paper-to-hub
          return (sourceIsHub && targetIsPaper) || (sourceIsPaper && targetIsHub);
        });

        setData({
          nodes: [...hubs, ...papers],
          links: validLinks,
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

  // ✅ Position hubs in a circle, papers around their hubs
  useEffect(() => {
    if (data.nodes.length === 0 || size.w === 0 || size.h === 0) return;

    const newNodes = [...data.nodes];
    const hubs = newNodes.filter((n: Node) => n.type === "hub");
    const papers = newNodes.filter((n: Node) => n.type === "paper");

    // Position hubs in a circle
    const centerX = size.w / 2;
    const centerY = size.h / 2;
    const hubRadius = Math.min(size.w, size.h) * 0.25;

    hubs.forEach((hub: Node, i: number) => {
      const angle = (i / hubs.length) * Math.PI * 2 - Math.PI / 2; // Start at top
      hub.fx = centerX + Math.cos(angle) * hubRadius;
      hub.fy = centerY + Math.sin(angle) * hubRadius;
    });

    // Position papers around their connected hubs
    papers.forEach((paper: Node) => {
      const connectedLinks = data.links.filter(
        (l: Link) => l.source === paper.id || l.target === paper.id
      );

      if (connectedLinks.length > 0) {
        const link = connectedLinks[0];
        const hubId = link.source === paper.id ? link.target : link.source;
        const hub = hubs.find((h: Node) => h.id === hubId);

        if (hub && hub.fx !== undefined && hub.fy !== undefined) {
          // Find all papers connected to this hub
          const hubPapers = papers.filter((p: Node) =>
            data.links.some(
              (l: Link) =>
                (l.source === p.id && l.target === hubId) ||
                (l.target === p.id && l.source === hubId)
            )
          );

          const paperIndex = hubPapers.findIndex((p: Node) => p.id === paper.id);
          const totalPapers = hubPapers.length;
          const paperAngle =
            totalPapers > 0
              ? (paperIndex / totalPapers) * Math.PI * 2 - Math.PI / 2
              : 0;
          const paperDistance = 100; // Slightly further to avoid overlap

          // Set fixed position around hub - keep papers fixed to maintain hub-and-spoke layout
          paper.fx = hub.fx + Math.cos(paperAngle) * paperDistance;
          paper.fy = hub.fy + Math.sin(paperAngle) * paperDistance;
        }
      }
    });

    // Update data to trigger re-render
    setData({ ...data, nodes: newNodes });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.nodes.length, size.w, size.h]);

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
        className="w-full h-[450px] rounded-lg overflow-hidden border border-gray-100"
      >
        {size.w > 0 && size.h > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={size.w}
            height={size.h}
            graphData={data}
            backgroundColor="#ffffff"
            nodeCanvasObject={drawNode}
            linkColor={() => "#64748b"}
            linkWidth={() => 2}
            linkOpacity={0.8}
            enableNodeDrag={false}
            cooldownTicks={100}
            d3Force="charge"
            d3ForceCharge={(node: any) => {
              // Strong repulsion between hubs, weaker for papers
              return node.type === "hub" ? -400 : -80;
            }}
            d3ForceLinkDistance={(link: any) => {
              // Keep papers close to their hubs
              return 90;
            }}
            d3ForceLinkStrength={1.0}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.5}
            onNodeClick={(n: any) => {
              if (n.type === "paper") window.open(`/papers/${n.id}`, "_blank");
            }}
            onEngineStop={() => {
              // Zoom to fit after simulation settles
              setTimeout(() => {
                fgRef.current?.zoomToFit(400, 50);
              }, 100);
            }}
          />
        )}
      </div>
    </div>
  );
}
