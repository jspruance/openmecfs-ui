/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  fx?: number;
  fy?: number;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

type GraphPayload = {
  nodes: Node[];
  links: Link[];
  awaiting?: string[];
};

const HUB_RADIUS = 260;
const PAPER_RADIUS = 140;

function truncate(s?: string, n = 48) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export default function LiveGraphCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [graph, setGraph] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  // Keep zoom-to-fit stable & predictable
  const zoomToFit = () => {
    // Defer a couple frames so ForceGraph has painted
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        try {
          fgRef.current?.zoomToFit?.(600, 60);
        } catch {}
      })
    );
  };

  // Size observer
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(() => {
      setSize({
        w: containerRef.current!.clientWidth,
        h: containerRef.current!.clientHeight,
      });
      zoomToFit();
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch and normalize
  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/graph/global`
      );
      const raw: GraphPayload = await res.json();

      const hubs = raw.nodes.filter((n) => n.type === "hub");
      const hubIds = new Set(hubs.map((h) => h.id));
      const awaiting = new Set(raw.awaiting || []);

      // Only links paper -> known hub; drop awaiting papers
      const dedup = new Set<string>();
      const links: Link[] = [];
      for (const l of raw.links || []) {
        if (!hubIds.has(l.target)) continue;
        if (awaiting.has(l.source)) continue;
        const key = `${l.source}->${l.target}`;
        if (!dedup.has(key)) {
          dedup.add(key);
          links.push({ source: l.source, target: l.target, type: l.type });
        }
      }

      // Assign each paper to first hub it links to
      const firstHub = new Map<string, string>();
      for (const l of links) {
        if (!firstHub.has(l.source)) firstHub.set(l.source, l.target);
      }

      // Keep only assigned papers
      const papers = raw.nodes
        .filter((n) => n.type === "paper" && firstHub.has(n.id))
        .map((p) => ({
          ...p,
          label: truncate(p.title || p.label, 56),
          val: 2,
        }));

      // Style hubs
      const hubsStyled = hubs.map((h) => ({ ...h, val: 12 }));

      // Build edges as paper -> hub
      const edges: Link[] = papers.map((p) => ({
        source: p.id,
        target: firstHub.get(p.id)!,
        type: "paper→mechanism",
      }));

      // Deterministic positions (radial, centered at 0,0)
      const allNodes: Node[] = [...hubsStyled, ...papers];
      applyRadialPositions(allNodes, edges);

      setGraph({ nodes: allNodes, links: edges });
      zoomToFit();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drawing
  const drawNode = useMemo(() => {
    return (
      node: Node & { x: number; y: number },
      ctx: CanvasRenderingContext2D,
      scale: number
    ) => {
      const isHub = node.type === "hub";
      const r = isHub ? 16 : 6;

      const COLORS = {
        hub: "#f59e0b",
        paper: "#2563eb",
        text: "#1f2937",
      };

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
      ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
      ctx.fill();

      const label = node.label || node.title || node.id;
      if (label) {
        const fontSize = (isHub ? 18 : 11) / Math.max(1, scale);
        ctx.font = `${fontSize}px Inter, system-ui, -apple-system`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = COLORS.text;
        ctx.fillText(label, node.x, node.y + r + 3);
      }
    };
  }, []);

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
            graphData={graph}
            backgroundColor="#ffffff"
            nodeCanvasObject={drawNode}
            linkColor={() => "#CBD5E1"}
            linkWidth={() => 1.25}
            linkOpacity={0.9}
            // ✅ keep zoom & pan
            enableZoomPanInteraction={true}
            // ✅ no physics jitter
            cooldownTicks={0}
            d3AlphaDecay={1}
            d3VelocityDecay={1}
            enableNodeDrag={false}
            onEngineStop={zoomToFit}
            onNodeHover={(n: any) => {
              document.body.style.cursor =
                n && n.type === "paper" ? "pointer" : "default";
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

/** Radial layout: hubs on a ring; papers evenly around their hub. */
function applyRadialPositions(nodes: Node[], links: Link[]) {
  const hubs = nodes.filter((n) => n.type === "hub");
  const papers = nodes.filter((n) => n.type === "paper");

  // Place hubs
  hubs.forEach((h, i) => {
    const a = (i / Math.max(1, hubs.length)) * Math.PI * 2;
    h.fx = Math.cos(a) * HUB_RADIUS;
    h.fy = Math.sin(a) * HUB_RADIUS;
  });

  // Map paper -> hub and group by hub
  const paperHub = new Map<string, string>();
  links.forEach((l) => paperHub.set(l.source, l.target));

  const grouped = new Map<string, Node[]>();
  hubs.forEach((h) => grouped.set(h.id, []));
  papers.forEach((p) => {
    const hid = paperHub.get(p.id);
    if (hid && grouped.has(hid)) grouped.get(hid)!.push(p);
  });

  // Place papers around their hub
  hubs.forEach((h) => {
    const group = grouped.get(h.id) || [];
    if (!group.length) return;
    group.forEach((p, idx) => {
      const a = (idx / group.length) * Math.PI * 2;
      const hx = h.fx ?? 0;
      const hy = h.fy ?? 0;
      p.fx = hx + Math.cos(a) * PAPER_RADIUS;
      p.fy = hy + Math.sin(a) * PAPER_RADIUS;
    });
  });
}
