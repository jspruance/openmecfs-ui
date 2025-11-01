"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, ListCollapse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

interface Paper {
  id: string;
  title: string;
  authors: string;
  year: number;
  abstract?: string;
  cluster_label: number;
  pmid?: string | number; // optional PubMed ID
}

interface Props {
  clusterId: number | null;
}

export default function PapersPanel({ clusterId }: Props) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clusterId) return;
    setLoading(true);
    setError(null);
    setPapers([]);
    setExpandedIds([]);
    setAllExpanded(false);

    api
      .get(`/papers-sb?cluster_label=${clusterId}`)
      .then((res) => setPapers(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [clusterId]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedIds([]);
      setAllExpanded(false);
    } else {
      setExpandedIds(papers.map((p) => p.id));
      setAllExpanded(true);
    }
  };

  if (!clusterId) {
    return (
      <div className="flex items-center justify-center h-full border rounded-xl text-slate-500 dark:text-slate-400">
        Select a subtype to view related papers
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (papers.length === 0) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400 italic py-10">
        No papers found for this subtype.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Papers for Subtype {clusterId}
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {papers.length} {papers.length === 1 ? "paper" : "papers"} found
          </span>
        </div>

        <button
          onClick={toggleAll}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
        >
          <ListCollapse size={16} />
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* 🔹 Paper list */}
      {papers.map((paper) => {
        const isExpanded = expandedIds.includes(paper.id);
        const pubmedUrl = paper.pmid
          ? `https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`
          : null;

        return (
          <Card
            key={paper.id}
            className="transition-all border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md"
          >
            <CardHeader
              className="cursor-pointer flex justify-between items-start"
              onClick={() => toggleExpand(paper.id)}
            >
              <div className="flex-1 pr-2">
                {pubmedUrl ? (
                  <a
                    href={pubmedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 group"
                    onClick={(e) => e.stopPropagation()} // prevent expand on link click
                  >
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {paper.title}
                    </CardTitle>
                    <ExternalLink
                      size={14}
                      className="mt-[3px] text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-300"
                    />
                  </a>
                ) : (
                  <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition">
                    {paper.title}
                  </CardTitle>
                )}

                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {paper.authors} ({paper.year})
                </p>
              </div>

              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="ml-3 mt-1 text-slate-500 dark:text-slate-400"
              >
                <ChevronDown size={18} />
              </motion.div>
            </CardHeader>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {paper.abstract || "No abstract available."}
                    </p>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}
