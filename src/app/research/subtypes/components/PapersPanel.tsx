"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown, ExternalLink, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

interface Paper {
  id?: string;
  pmid?: string | number;
  title: string;
  authors: string | string[];
  year: number;
  abstract?: string;
  cluster?: number;
  cluster_label?: number;
}

interface Props {
  clusterId: number | null;
}

export default function PapersPanel({ clusterId }: Props) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Reset when cluster changes
  useEffect(() => {
    if (containerRef.current && containerRef.current.scrollTop > 0) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setSearchTerm("");
  }, [clusterId]);

  // ✅ Fetch papers from `/papers-sb/`
  useEffect(() => {
    if (clusterId === null) return;
    setLoading(true);
    setExpandedIds([]);

    api
      .get("/papers-sb/", {
        params: { cluster: clusterId },
      })
      .then((res) => {
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : [];

        setPapers(list);
      })
      .finally(() => setLoading(false));
  }, [clusterId]);

  if (clusterId === null) {
    return (
      <div className="flex items-center justify-center h-full border rounded-xl text-slate-500 dark:text-slate-400">
        Select a subtype to view related papers
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl"
          />
        ))}
      </div>
    );
  }

  const filteredPapers = papers.filter((p) => {
    const q = debouncedSearch.toLowerCase();

    const title = (p.title || "").toLowerCase();
    const authors = Array.isArray(p.authors)
      ? p.authors.join(", ").toLowerCase()
      : (p.authors || "").toLowerCase();
    const abstract = (p.abstract || "").toLowerCase();

    return title.includes(q) || authors.includes(q) || abstract.includes(q);
  });

  return (
    <motion.div
      key={clusterId}
      ref={containerRef}
      className="space-y-4 overflow-y-auto"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Search */}
      <div className="flex items-center gap-2 sticky top-0 bg-white dark:bg-slate-900 py-2 z-10">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <input
            className="w-full pl-8 pr-2 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-sm border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPapers.map((p, idx) => {
        const uniqueKey = p.id || String(p.pmid || `paper-${idx}`);
        const isOpen = expandedIds.includes(uniqueKey);
        const pubmedUrl = p.pmid
          ? `https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`
          : null;

        return (
          <Card
            key={uniqueKey}
            className="transition border-slate-200 dark:border-slate-700 hover:shadow-md"
          >
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleExpand(uniqueKey)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  {pubmedUrl ? (
                    <a
                      href={pubmedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 group"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CardTitle className="text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {p.title}
                      </CardTitle>
                      <ExternalLink
                        size={14}
                        className="mt-[3px] text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-300"
                      />
                    </a>
                  ) : (
                    <CardTitle className="text-base">{p.title}</CardTitle>
                  )}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {Array.isArray(p.authors)
                      ? p.authors.join(", ")
                      : p.authors}{" "}
                    ({p.year})
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="text-slate-400"
                >
                  <ChevronDown size={16} />
                </motion.div>
              </div>
            </CardHeader>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <CardContent className="pt-0 pb-4">
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {p.abstract ?? "No abstract available."}
                    </p>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}

      {filteredPapers.length === 0 && (
        <div className="text-sm text-slate-500 dark:text-slate-400 p-4">
          No papers found.
        </div>
      )}
    </motion.div>
  );
}
