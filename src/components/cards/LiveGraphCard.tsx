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
  x?: number;
  y?: number;
  val?: number;
  fx?: number;
  fy?: number;
  confidence?: number;
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

function truncate(s: string, n: number) {
  if (!s) return s;
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

  // Observe container size
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

  // Fetch + normalize API
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res: GraphPayload) => {
        // Separate hubs and papers
        const hubs = res.nodes.filter((n) => n.type === "hub");
        const hubIds = new Set(hubs.map((h) => h.id));
        const awaiting = new Set(res.awaiting || []);

        // Papers with titles preferred for labels
        const papersAll = res.nodes.filter((n) => n.type === "paper");

        // Keep only links that go to a known hub
        // Your API is paper -> mechanism (paper is source)
        const rawLinks = (res.links || []).filter(
          (l) => hubIds.has(l.target) && !awaiting.has(l.source)
        );

        // Deduplicate links
        const seen = new Set<string>();
        const links: Link[] = [];
        for (const l of rawLinks) {
          const k = `${l.source}->${l.target}`;
          if (!seen.has(k)) {
            seen.add(k);
            links.push({ source: l.source, target: l.target, type: l.type });
          }
        }

        // Assign each paper to its first valid hub
        const paperToHub = new Map<string, string>();
        for (const l of links) {
          if (!paperToHub.has(l.source)) paperToHub.set(l.source, l.target);
        }

        // Only keep papers that have a valid assignment
        const assignedPapers = papersAll
          .filter((p) => paperToHub.has(p.id))
          .map((p) => ({
            ...p,
            label: p.title ? truncate(p.title, 48) : p.label,
            val: 2,
          }));

        // Hubs styling
        const hubsStyled = hubs.map((h) => ({ ...h, val: 12 }));

        // Build edges strictly hub<->paper for the assigned set
        const edges: Link[] = assignedPapers.map((p) => ({
          source: p.id,
          target: paperToHub.get(p.id)!,
          type: "paper→mechanism",
        }));

        // Deterministic positions (radial)
        const allNodes: Node[] = [...hubsStyled, ...assignedPapers];
        applyStablePositions(allNodes, edges);

        setGraph({ nodes: allNodes, links: edges });

        // Zoom to fit after render
        setTimeout(() => {
          try {
            fgRef.current?.zoomToFit?.(600, 60);
          } catch {}
        }, 0);
      })
      .catch((err) => {
        console.error("Graph fetch failed", err);
        setGraph({ nodes: [], links: [] });
      });
  }, []);

  // Draw nodes
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

      // Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
      ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
      ctx.fill();

      // Label
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
            linkWidth={() => 1.3}
            linkOpacity={0.9}
            enableNodeDrag={false}
            onNodeHover={(n: any) => {
              document.body.style.cursor =
                n && n.type === "paper" ? "pointer" : "default";
            }}
            onNodeClick={(n: any) => {
              if (n?.type === "paper") {
                window.open(`/papers/${n.id}`, "_blank");
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Deterministic radial positions, no physics.
 * - Hubs on a ring
 * - Papers evenly orbit their assigned hub
 */
function applyStablePositions(nodes: Node[], links: Link[]) {
  const hubs = nodes.filter((n) => n.type === "hub");
  const papers = nodes.filter((n) => n.type === "paper");

  // Centered at 0,0 — ForceGraph will zoomToFit
  const HUB_RADIUS = 240;
  const PAPER_RADIUS = 130;

  // Place hubs
  hubs.forEach((h, i) => {
    const ang = (i / Math.max(1, hubs.length)) * Math.PI * 2;
    h.fx = Math.cos(ang) * HUB_RADIUS;
    h.fy = Math.sin(ang) * HUB_RADIUS;
  });

  // Group papers by their hub (from links)
  const papersByHub = new Map<string, Node[]>();
  hubs.forEach((h) => papersByHub.set(h.id, []));
  const hubOfPaper = new Map<string, string>();

  for (const l of links) {
    // source = paper, target = hub (normalized above)
    hubOfPaper.set(l.source, l.target);
  }

  for (const p of papers) {
    const hid = hubOfPaper.get(p.id);
    if (hid && papersByHub.has(hid)) {
      papersByHub.get(hid)!.push(p);
    }
  }

  // Place papers around their hub
  hubs.forEach((h) => {
    const group = papersByHub.get(h.id) || [];
    if (group.length === 0) return;

    group.forEach((p, j) => {
      const pa = (j / group.length) * Math.PI * 2;
      const hx = h.fx ?? 0;
      const hy = h.fy ?? 0;
      p.fx = hx + Math.cos(pa) * PAPER_RADIUS;
      p.fy = hy + Math.sin(pa) * PAPER_RADIUS;
    });
  });
}
