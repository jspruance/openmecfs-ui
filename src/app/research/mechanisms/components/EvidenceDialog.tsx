"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { fetchEuropePmcPaper } from "@/lib/papers/europePmc";
import { Mechanism } from "../data";

interface Props {
  mech: Mechanism;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

type PaperMeta = {
  title: string;
  year?: string;
  pmid: string;
  abstract?: string;
};

export default function EvidenceDialog({ mech, open, onOpenChange }: Props) {
  const [papers, setPapers] = useState<PaperMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const ids = Array.isArray(mech.papers) ? mech.papers : [];

    if (ids.length === 0) {
      setPapers([]);
      setError(null);
      setLoading(false);
      return;
    }

    setPapers([]);
    setError(null);
    setLoading(true);

    let cancelled = false;

    async function loadPapers() {
      try {
        const results: PaperMeta[] = [];

        for (const id of ids) {
          try {
            const data = await fetchEuropePmcPaper(id);

            results.push({
              pmid: id,
              title: data?.title || `Paper ${id}`,
              year:
                data?.pubYear ?? data?.firstPublicationDate?.slice(0, 4) ?? "",
              abstract: data?.abstractText ?? data?.abstract ?? "",
            });
          } catch {
            results.push({
              pmid: id,
              title: `Paper ${id}`,
              year: "",
              abstract: "",
            });
          }
        }

        if (!cancelled) setPapers(results);
      } catch {
        if (!cancelled) setError("Failed to fetch evidence");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPapers();
    return () => {
      cancelled = true;
    };
  }, [open, mech.papers]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-lg rounded-xl 
          bg-white dark:bg-slate-900 
          border border-slate-200 dark:border-slate-700
          shadow-2xl p-6
        "
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-2xl">{mech.icon}</span>
            {mech.title} — Evidence
          </DialogTitle>
          <DialogDescription>
            Key research signals supporting this mechanism.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <p className="text-sm text-muted-foreground mt-4">Loading papers…</p>
        )}
        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        {!loading && !error && (
          <div className="mt-4 space-y-3">
            {papers.length > 0 ? (
              papers.map((p) => (
                <div
                  key={p.pmid}
                  className="
                    w-full text-left flex flex-col gap-2
                    p-3 rounded-lg border 
                    bg-white dark:bg-slate-800
                    text-slate-700 dark:text-slate-200
                    border-slate-300 dark:border-slate-700
                    hover:bg-slate-100 dark:hover:bg-slate-700
                    hover:border-slate-400 dark:hover:border-slate-500
                    shadow-sm hover:shadow-md
                    transition-all duration-150 active:scale-[0.98]
                  "
                >
                  {/* Title clickable */}
                  <div
                    className="cursor-pointer font-medium"
                    onClick={() =>
                      window.open(
                        `https://europepmc.org/article/MED/${p.pmid}`,
                        "_blank"
                      )
                    }
                  >
                    📄 {p.title} {p.year && `(${p.year})`}
                  </div>

                  {/* Abstract teaser */}
                  {p.abstract && (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {p.abstract.slice(0, 160)}…
                    </div>
                  )}

                  {/* View internal paper page link */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/papers/${p.pmid}`, "_blank");
                    }}
                    className="
                      text-xs text-blue-600 dark:text-blue-400 
                      underline underline-offset-2 
                      cursor-pointer
                      mt-1
                    "
                  >
                    View details →
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No papers yet — coming soon.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
