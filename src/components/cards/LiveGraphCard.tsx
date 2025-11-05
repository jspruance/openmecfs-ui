/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Client-only import
const ForceGraph2D: any = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

// -------- Types --------
interface Node {
  id: string;
  type: "hub" | "paper";
  // optional data from API
  label?: string;
  title?: string;
  pmid?: string | number;

  // set/used by force-graph
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  val?: number;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

type GraphData = { nodes: Node[]; links: Link[] };

// -------- Component --------
export default function LiveGraphCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });

  // Keep sizing accurate
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

  // Fetch + deterministic radial layout (no physics surprises)
  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/graph/global`
      );
      const raw = await res.json();

      const hubs: Node[] = (raw.nodes as Node[]).filter(
        (n) => n.type === "hub"
      );
      const papers: Node[] = (raw.nodes as Node[]).filter(
        (n) => n.type === "paper"
      );
      const links: Link[] = raw.links || [];

      // Visual scale relative to box
      const base = Math.min(size.w || 800, size.h || 420);
      const hubRingR = Math.max(140, Math.round(base * 0.28)); // distance of hubs from center
      const paperRingR = Math.max(70, Math.round(base * 0.14)); // distance of papers around hub

      // Position hubs evenly around a circle
      hubs.forEach((hub, i) => {
        const a = (i / Math.max(1, hubs.length)) * Math.PI * 2;
        hub.x = Math.cos(a) * hubRingR;
        hub.y = Math.sin(a) * hubRingR;
        hub.fx = hub.x;
        hub.fy = hub.y;
        hub.val = 12;
      });

      // Distribute papers around hubs, wrap papers across hubs
      papers.forEach((paper, i) => {
        const hub = hubs[i % Math.max(1, hubs.length)];
        const a = (i / Math.max(1, papers.length)) * Math.PI * 2;
        // small jitter to avoid perfect overlap
        const jitter = 6;
        const dx =
          Math.cos(a) * paperRingR + (Math.random() * jitter - jitter / 2);
        const dy =
          Math.sin(a) * paperRingR + (Math.random() * jitter - jitter / 2);

        paper.x = (hub?.x || 0) + dx;
        paper.y = (hub?.y || 0) + dy;
        paper.fx = paper.x;
        paper.fy = paper.y;
        paper.val = 3;
      });

      setData({ nodes: [...hubs, ...papers], links });

      // Fit to view after mount
      setTimeout(() => fgRef.current?.zoomToFit?.(500, 40), 150);
    };

    load();
    // run when size first becomes non-zero (so layout scales to box)
  }, [size.w, size.h]);

  // -------- Rendering helpers --------
  const COLORS = useMemo(
    () => ({
      hub: "#f59e0b",
      paper: "#2563eb",
      text: "#0f172a",
      link: "#cbd5e1",
    }),
    []
  );

  // Robust label selector with graceful fallback
  const getNodeLabel = (n: Node) => {
    const raw =
      (n.title && String(n.title)) ||
      (n.label && String(n.label)) ||
      (n.pmid && String(n.pmid)) ||
      String(n.id);

    const limit = n.type === "hub" ? 26 : 34; // show more text for papers (above bubble)
    return raw.length > limit ? raw.slice(0, limit - 1) + "…" : raw;
  };

  // Custom node painter
  const drawNode = (n: any, ctx: CanvasRenderingContext2D, scale: number) => {
    const node = n as Node & { x: number; y: number };
    const isHub = node.type === "hub";
    const r = isHub ? 16 : 7;

    // dot
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
    ctx.fill();

    // label
    const label = getNodeLabel(node);
    if (label) {
      const fontSize = (isHub ? 16 : 12) / Math.max(0.8, scale);
      ctx.font = `${fontSize}px Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = COLORS.text;

      const yOffset = isHub ? r + 4 : r + 2;
      ctx.fillText(label, node.x, node.y + yOffset);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        🧠 Live Mechanism Network
        <span className="text-xs text-gray-500">(stable radial layout)</span>
      </div>

      <div
        ref={containerRef}
        className="w-full h-[440px] rounded-lg overflow-hidden border border-gray-100"
      >
        {size.w > 0 && size.h > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={size.w}
            height={size.h}
            graphData={data}
            backgroundColor="#ffffff"
            // No physics (we pre-position and freeze with fx/fy)
            cooldownTicks={0}
            d3VelocityDecay={1}
            d3AlphaDecay={1}
            nodeRelSize={4}
            linkColor={() => COLORS.link}
            linkOpacity={0.75}
            linkWidth={() => 1.15}
            nodeCanvasObject={(
              n: any,
              ctx: CanvasRenderingContext2D,
              s: number
            ) => drawNode(n, ctx, s)}
            onNodeHover={(n: any) => {
              document.body.style.cursor = n ? "pointer" : "default";
            }}
            onNodeClick={(n: any) => {
              if (n?.type === "paper") window.open(`/papers/${n.id}`, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
}
