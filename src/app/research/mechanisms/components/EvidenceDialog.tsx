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
              // ✅ unified year extraction
              year:
                data?.pubYear ?? data?.firstPublicationDate?.slice(0, 4) ?? "",
            });
          } catch {
            results.push({ pmid: id, title: `Paper ${id}`, year: "" });
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
  }, [open, mech.id]);

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
          <div className="mt-4 space-y-2">
            {papers.length > 0 ? (
              papers.map((p) => (
                <button
                  key={p.pmid}
                  onClick={() =>
                    window.open(
                      `https://europepmc.org/article/MED/${p.pmid}`,
                      "_blank"
                    )
                  }
                  className="
                    w-full flex items-center gap-2 
                    text-sm font-medium
                    p-3 rounded-lg
                    border border-slate-300 dark:border-slate-700
                    bg-white dark:bg-slate-800
                    text-slate-700 dark:text-slate-200
                    hover:bg-slate-100 dark:hover:bg-slate-700
                    hover:border-slate-400 dark:hover:border-slate-500
                    shadow-sm hover:shadow-md
                    cursor-pointer
                    transition-all duration-150 active:scale-[0.98]
                  "
                >
                  📄 {p.title} {p.year && `(${p.year})`}
                </button>
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
