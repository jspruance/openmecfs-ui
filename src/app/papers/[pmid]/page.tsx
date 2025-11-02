"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { fetchEuropePmcPaper, type EuropePmcPaper } from "@/lib/papers/europePmc";
import EvidenceChips from "@/components/EvidenceChips";
import GenerateEvidenceButton from "@/components/GenerateEvidenceButton";

interface InternalPaper {
  id: string;
  [key: string]: unknown;
}

interface Evidence {
  mechanisms?: string[];
  biomarkers?: string[];
  confidence?: number;
  [key: string]: unknown;
}

export default function PaperPage() {
  const params = useParams();
  const pmid = params.pmid as string;

  const [paper, setPaper] = useState<EuropePmcPaper | null>(null);
  const [internalPaper, setInternalPaper] = useState<InternalPaper | null>(null);
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch both external PMC + internal DB record
  const loadData = useCallback(async () => {
    setLoading(true);

    // 1️⃣ External fetch (PMC)
    const external = await fetchEuropePmcPaper(pmid);

    setPaper(external);

    // 2️⃣ Ensure internal paper exists in Supabase
    const dbRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/papers/sync/${pmid}`,
      { method: "POST" }
    );
    const dbPaper = (await dbRes.json()) as InternalPaper;
    setInternalPaper(dbPaper);

    // 3️⃣ Fetch existing evidence if exists
    const evRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/papers/${dbPaper.id}/summaries`,
      { cache: "no-store" }
    ).catch(() => null);

    const ev = evRes?.ok ? ((await evRes.json()) as Evidence) : null;
    setEvidence(ev);

    setLoading(false);
  }, [pmid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 text-sm opacity-70">
        Loading paper details...
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        ❓ Paper not found for PMID: {pmid}
      </div>
    );
  }

  const { title, abstract, journal, year, authors, link } = paper;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        📄 Paper — {pmid}
      </h1>

      <div className="mt-4 rounded-lg border p-4 bg-white dark:bg-slate-900">
        <div className="text-xl font-medium">
          {title || "Title unavailable"}
        </div>

        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {authors || "Unknown authors"}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {journal || "Unknown journal"} • {year || "n.d."}
        </div>

        <h2 className="mt-6 font-semibold">Abstract</h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
          {abstract || "No abstract available."}
        </p>

        {/* Evidence Engine actions & display */}
        {internalPaper && (
          <GenerateEvidenceButton
            paperId={internalPaper.id}
            onComplete={() => loadData()}
          />
        )}

        {evidence && (
          <EvidenceChips
            mechanisms={evidence.mechanisms}
            biomarkers={evidence.biomarkers}
            confidence={evidence.confidence}
          />
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-600 dark:text-blue-400 underline underline-offset-2"
            style={{ cursor: "pointer" }}
          >
            View on Europe PMC →
          </a>
        )}
      </div>
    </div>
  );
}
