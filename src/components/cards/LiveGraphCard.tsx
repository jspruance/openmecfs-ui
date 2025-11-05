/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

type Graph = { nodes: Node[]; links: Link[] };

export default function LiveGraphCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<Graph>({ nodes: [], links: [] });

  // Fetch + prep data
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res: Graph) => {
        const hubs = res.nodes.filter((n) => n.type === "hub");
        const papers = res.nodes.filter((n) => n.type === "paper");

        // sizes
        hubs.forEach((h) => (h.val = 12));
        papers.forEach((p) => (p.val = 2.5));

        // labels
        hubs.forEach((h) => (h.label = h.label || h.id));
        papers.forEach((p) => {
          const raw = p.title || p.label || `PMID: ${p.id}`;
          p.label = raw.length > 60 ? `${raw.slice(0, 58)}…` : raw;
        });

        setData({ nodes: [...hubs, ...papers], links: res.links || [] });

        // let the graph mount, then zoom
        setTimeout(() => fgRef.current?.zoomToFit?.(800, 80), 500);
      });
  }, []);

  // Helpers: hub list, anchors, and paper→hub map
  const hubs = useMemo(
    () => data.nodes.filter((n) => n.type === "hub"),
    [data.nodes]
  );

  const hubAnchors = useMemo(() => {
    // place hubs on a circle inside the canvas area
    const count = Math.max(hubs.length, 1);
    const centerX = size.w / 2;
    const centerY = size.h / 2;
    const radius = Math.min(size.w, size.h) * 0.3; // circle radius

    const anchors: Record<string, { x: number; y: number }> = {};
    hubs.forEach((h, i) => {
      const angle = (i / count) * Math.PI * 2;
      anchors[h.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    return anchors;
  }, [hubs, size.w, size.h]);

  const paperToHub = useMemo(() => {
    // map each paper to its connected hub via paper-mechanism link
    const map: Record<string, string> = {};
    data.links.forEach((l) => {
      if (l.type === "paper-mechanism") {
        // links might be paper->hub or hub->paper, normalize:
        const s =
          typeof l.source === "string" ? l.source : (l.source as any).id;
        const t =
          typeof l.target === "string" ? l.target : (l.target as any).id;
        const sNode = data.nodes.find((n) => n.id === s);
        const tNode = data.nodes.find((n) => n.id === t);
        if (!sNode || !tNode) return;
        if (sNode.type === "paper" && tNode.type === "hub")
          map[sNode.id] = tNode.id;
        if (tNode.type === "paper" && sNode.type === "hub")
          map[tNode.id] = sNode.id;
      }
    });
    return map;
  }, [data.nodes, data.links]);

  // Apply D3 forces once the graph + size is ready
  useEffect(() => {
    if (
      !fgRef.current ||
      size.w === 0 ||
      size.h === 0 ||
      data.nodes.length === 0
    )
      return;

    const g = fgRef.current;

    // Charge: hubs repel more, papers less
    g.d3Force("charge")?.strength((n: Node) => (n.type === "hub" ? -600 : -80));

    // Collision to prevent overlap
    g.d3Force("collision")?.radius((n: Node) => (n.type === "hub" ? 28 : 12));

    // Link distances — keep papers close to their hub, hubs farther apart
    g.d3Force("link")?.distance((l: Link) =>
      l.type === "paper-mechanism" ? 110 : 240
    );

    // Anchor hubs to circle; gently pull papers toward their hub anchor
    g.d3Force("x")
      ?.strength((n: Node) => (n.type === "hub" ? 0.2 : 0.04))
      .x((n: Node) => {
        if (n.type === "hub") return hubAnchors[n.id]?.x ?? size.w / 2;
        const hId = paperToHub[n.id];
        return hId ? hubAnchors[hId]?.x ?? size.w / 2 : size.w / 2;
      });

    g.d3Force("y")
      ?.strength((n: Node) => (n.type === "hub" ? 0.2 : 0.04))
      .y((n: Node) => {
        if (n.type === "hub") return hubAnchors[n.id]?.y ?? size.h / 2;
        const hId = paperToHub[n.id];
        return hId ? hubAnchors[hId]?.y ?? size.h / 2 : size.h / 2;
      });

    // Settle reasonably fast
    g.cooldownTicks(400);
    g.d3VelocityDecay(0.3);
    g.d3AlphaDecay(0.02);
  }, [hubAnchors, paperToHub, data.nodes.length, size.w, size.h]);

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

  // Draw nodes
  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const isHub = node.type === "hub";
    const r = isHub ? 22 : 8;

    const COLORS = {
      hub: "#f59e0b",
      paper: "#2563eb",
      text: "#1e293b",
    };

    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
    ctx.fill();

    const label = node.label || "";
    const fontSize = (isHub ? 16 : 10) / scale;
    if (fontSize >= 6) {
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.text;
      ctx.fillText(label, node.x, node.y - r - 4);
    }
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
        className="w-full h-[460px] rounded-lg overflow-hidden border border-gray-100"
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
            linkOpacity={0.85}
            nodeRelSize={4}
            // keep the engine warm long enough to settle into anchors
            warmupTicks={60}
            cooldownTicks={400}
            d3VelocityDecay={0.3}
            d3AlphaDecay={0.02}
            onNodeHover={(n: any) => {
              document.body.style.cursor = n ? "pointer" : "default";
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
