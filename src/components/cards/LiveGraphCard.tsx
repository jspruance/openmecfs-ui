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

const HUB_ORDER = [
  "hub:neuroinflammation",
  "hub:viral",
  "hub:autonomic",
  "hub:immune",
  "hub:vascular",
  "hub:mitochondrial",
] as const;

export default function LiveGraphCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  // Fetch data
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => {
        const hubs: Node[] = (res.nodes as Node[]).filter(
          (n) => n.type === "hub"
        );
        const papersAll: Node[] = (res.nodes as Node[]).filter(
          (n) => n.type === "paper"
        );

        // Only keep links that point to one of our hubs and whose source is a kept paper
        const filteredPapers = papersAll.filter((p: Node) =>
          (res.links as Link[]).some(
            (l: Link) =>
              l.source === p.id && HUB_ORDER.includes(l.target as any)
          )
        );
        const filteredLinks = (res.links as Link[]).filter(
          (l: Link) =>
            HUB_ORDER.includes(l.target as any) &&
            filteredPapers.some((p: Node) => p.id === l.source)
        );

        // Node sizes
        hubs.forEach((h) => (h.val = 8));
        filteredPapers.forEach((p) => (p.val = 2));

        setData({
          nodes: [...hubs, ...filteredPapers],
          links: filteredLinks,
        });
      })
      .catch(() => {
        // Fail silently for now
      });
  }, []);

  // Resize observer
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

  // Size-aware radial layout, re-run on data or size change
  useEffect(() => {
    if (!data.nodes.length || !size.w || !size.h) return;

    // Clear any previous pins
    data.nodes.forEach((n) => {
      n.fx = undefined;
      n.fy = undefined;
    });

    const hubs = data.nodes.filter((n) => n.type === "hub");
    const papers = data.nodes.filter((n) => n.type === "paper");

    // Place hubs in a radial ring centered in the canvas
    const cx = 0; // graph coords; we’ll zoomToFit afterward
    const cy = 0;
    const ringRadius = Math.min(size.w, size.h) * 0.28; // ring size relative to canvas

    const orderedHubs = HUB_ORDER.map((hid) =>
      hubs.find((h) => h.id === hid)
    ).filter(Boolean) as Node[];

    orderedHubs.forEach((hub, i) => {
      const angle = (i / orderedHubs.length) * Math.PI * 2 - Math.PI / 2;
      hub.fx = cx + Math.cos(angle) * ringRadius;
      hub.fy = cy + Math.sin(angle) * ringRadius;
    });

    // For each hub, arrange its papers in a small arc around that hub
    const perHubRadius = Math.min(size.w, size.h) * 0.12;

    orderedHubs.forEach((hub) => {
      const hubPapers = papers.filter((p) =>
        data.links.some((l) => l.source === p.id && l.target === hub.id)
      );
      if (!hub.fx || !hub.fy || hubPapers.length === 0) return;

      hubPapers.forEach((p, j) => {
        const a = (j / hubPapers.length) * Math.PI * 2;
        const hubX = hub.fx ?? 0;
        const hubY = hub.fy ?? 0;
        p.fx = hubX + Math.cos(a) * perHubRadius;
        p.fy = hubY + Math.sin(a) * perHubRadius;
      });
    });

    // Trigger a zoomToFit after the frame so coordinates are honored
    requestAnimationFrame(() => {
      try {
        fgRef.current?.zoomToFit?.(600, 40);
      } catch {
        /* no-op */
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.nodes.length, size.w, size.h]);

  // Custom draw
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

    // Use title for papers, fallback to label; show label for hubs
    const base =
      node.type === "paper"
        ? node.title || node.label || node.id
        : node.label || "";
    if (base) {
      const label =
        base.length > (isHub ? 24 : 28)
          ? base.slice(0, isHub ? 22 : 26) + "…"
          : base;
      const fontSize = (isHub ? 18 : 12) / scale;
      ctx.font = `${fontSize}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.text;
      ctx.fillText(label, node.x, node.y - radius - 6);
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
            // Interactions
            enableNodeDrag={false}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            // Keep physics idle (we’re using fixed positions)
            cooldownTicks={0}
            d3VelocityDecay={0.35}
            d3AlphaDecay={0.05}
            onNodeClick={(n: any) => {
              if (n.type === "paper") window.open(`/papers/${n.id}`, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
}
