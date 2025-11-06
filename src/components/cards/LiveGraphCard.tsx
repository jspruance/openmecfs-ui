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

const hubPriority = [
  "immune",
  "vascular",
  "mitochondrial",
  "autonomic",
  "viral",
  "neuroinflammation",
];

export default function LiveGraphCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });
  const [raw, setRaw] = useState<any>(null);
  const [fullMode, setFullMode] = useState(false);

  // ------------------------------------------------------
  // 🧠 Fetch graph data once
  // ------------------------------------------------------
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/graph/global`)
      .then((r) => r.json())
      .then((res) => setRaw(res))
      .catch(() => {});
  }, []);

  // ------------------------------------------------------
  // 🔁 Process and layout graph depending on mode
  // ------------------------------------------------------
  useEffect(() => {
    if (!raw) return;

    const hubs: Node[] = (raw.nodes as Node[]).filter((n) => n.type === "hub");
    const allPapers: Node[] = (raw.nodes as Node[]).filter(
      (n) => n.type === "paper"
    );
    const allLinks: Link[] = raw.links || [];

    // Clean up titles
    allPapers.forEach((p) => {
      const rawTitle = p.title || p.label || p.id;
      const clean = rawTitle.replace(/\s+/g, " ").trim();
      p.title = clean.length > 80 ? clean.slice(0, 77) + "…" : clean;
    });

    hubs.forEach((h) => (h.val = 8));

    let nodes: Node[] = [];
    let links: Link[] = [];

    if (fullMode) {
      // ✅ FULL MODE — duplicate papers per hub
      HUB_ORDER.forEach((hubId) => {
        const hubLinks = allLinks.filter((l) => l.target === hubId);
        hubLinks.forEach((l) => {
          const origPaper = allPapers.find((p) => p.id === l.source);
          if (origPaper) {
            const clone: Node = {
              ...origPaper,
              id: `${origPaper.id}-${hubId}`,
            };
            clone.val = 2;
            nodes.push(clone);
            links.push({
              source: clone.id,
              target: hubId,
              type: "paper→mechanism",
            });
          }
        });
      });
      nodes.push(...hubs);
    } else {
      // ✅ SIMPLIFIED MODE — only one paper per primary hub
      function getPrimaryHub(paperId: string): string | null {
        const hubsForPaper = allLinks
          .filter((l) => l.source === paperId)
          .map((l) => l.target.replace("hub:", ""));
        return hubPriority.find((h) => hubsForPaper.includes(h)) || null;
      }

      const filteredPapers = allPapers
        .map((p) => {
          const primary = getPrimaryHub(p.id);
          return primary ? { ...p, primaryHub: `hub:${primary}` } : null;
        })
        .filter(Boolean) as (Node & { primaryHub: string })[];

      filteredPapers.forEach((p) => (p.val = 2));

      nodes = [...hubs, ...filteredPapers];
      links = filteredPapers.map((p) => ({
        source: p.id,
        target: p.primaryHub,
        type: "paper→mechanism",
      }));
    }

    setData({ nodes, links });

    setTimeout(() => {
      try {
        fgRef.current?.zoomToFit?.(800, 50);
      } catch {}
    }, 300);
  }, [raw, fullMode]);

  // ------------------------------------------------------
  // 📐 Layout effect
  // ------------------------------------------------------
  useEffect(() => {
    if (!data.nodes.length || !size.w || !size.h) return;

    const hubs = data.nodes.filter((n) => n.type === "hub");
    const papers = data.nodes.filter((n) => n.type === "paper");

    const cx = 0;
    const cy = 0;
    const ringRadius = Math.min(size.w, size.h) * 0.32;
    const perHubRadius = Math.min(size.w, size.h) * 0.14;

    const orderedHubs = HUB_ORDER.map((hid) =>
      hubs.find((h) => h.id === hid)
    ).filter(Boolean) as Node[];

    // Position hubs in a ring
    orderedHubs.forEach((hub, i) => {
      const angle = (i / orderedHubs.length) * Math.PI * 2 - Math.PI / 2;
      hub.fx = cx + Math.cos(angle) * ringRadius;
      hub.fy = cy + Math.sin(angle) * ringRadius;
    });

    // Position papers around each hub
    orderedHubs.forEach((hub) => {
      const hubPapers = papers.filter((p) =>
        data.links.some((l) => l.source === p.id && l.target === hub.id)
      );

      if (hub.fx == null || hub.fy == null || hubPapers.length === 0) return;

      const hubX = hub.fx;
      const hubY = hub.fy;

      hubPapers.forEach((p, j) => {
        const angle = (j / hubPapers.length) * Math.PI * 2;
        p.fx = hubX + Math.cos(angle) * perHubRadius;
        p.fy = hubY + Math.sin(angle) * perHubRadius;
      });
    });

    requestAnimationFrame(() => {
      try {
        fgRef.current?.zoomToFit?.(600, 50);
      } catch {}
    });
  }, [data.nodes.length, size.w, size.h]);

  // ------------------------------------------------------
  // 🪟 Track container resize
  // ------------------------------------------------------
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

  // ------------------------------------------------------
  // 🎨 Draw nodes
  // ------------------------------------------------------
  const drawNode = (
    node: Node & { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    scale: number
  ) => {
    const isHub = node.type === "hub";
    const radius = isHub ? 18 : 6;

    const COLORS = {
      hub: "#f59e0b",
      paper: "#2563eb",
      text: "#1e293b",
    };

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isHub ? COLORS.hub : COLORS.paper;
    ctx.fill();

    const base =
      node.type === "paper"
        ? node.title || node.label || node.id
        : node.label || "";
    if (base) {
      const label =
        base.length > (isHub ? 24 : 40)
          ? base.slice(0, isHub ? 22 : 38) + "…"
          : base;
      const fontSize = (isHub ? 18 : 11) / scale;
      ctx.font = `${fontSize}px Inter, system-ui, Segoe UI, Roboto, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.text;
      ctx.fillText(label, node.x, node.y - radius - 6);
    }
  };

  // ------------------------------------------------------
  // 🧩 Render
  // ------------------------------------------------------
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold flex items-center gap-2">
          🧠 Live Mechanism Network
          <span className="text-xs text-gray-500">
            ({fullMode ? "Full multi-hub view" : "Simplified view"})
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          Simplified
          <input
            type="checkbox"
            checked={fullMode}
            onChange={(e) => setFullMode(e.target.checked)}
            className="accent-blue-500 w-4 h-4 cursor-pointer"
          />
          Full
        </div>
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
            linkColor={() => "rgba(148,163,184,0.6)"}
            linkWidth={() => 1.2}
            linkCurvature={0}
            linkOpacity={0.8}
            enableNodeDrag={false}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            cooldownTicks={0}
            onNodeClick={(n: any) => {
              if (n.type === "paper")
                window.open(`/papers/${n.id.split("-")[0]}`, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
}
