"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  fetchEuropePmcPaper,
  type EuropePmcPaper,
} from "@/lib/papers/europePmc";
import GenerateEvidenceButton from "@/components/GenerateEvidenceButton";
import ConfidenceBar from "@/components/ConfidenceBar";
import SmartChipList from "@/components/SmartChipList";

interface InternalPaper {
  pmid: string;
  [key: string]: unknown;
}

interface Evidence {
  one_sentence?: string;
  technical_summary?: string;
  patient_summary?: string;
  mechanisms?: string[];
  biomarkers?: string[];
  confidence?: number;
  created_at?: string;
  status?: string;
}

export default function PaperPage() {
  const params = useParams();
  const pmid = params.pmid as string;

  const [paper, setPaper] = useState<EuropePmcPaper | null>(null);
  const [internalPaper, setInternalPaper] = useState<InternalPaper | null>(
    null
  );
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    // ✅ 1) External metadata
    const external = await fetchEuropePmcPaper(pmid);
    setPaper(external);

    // ✅ 2) Ensure paper exists in DB
    const dbRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/papers/sync/${pmid}`,
      { method: "POST" }
    );
    const dbPaper = (await dbRes.json()) as InternalPaper;
    setInternalPaper(dbPaper);

    // ✅ 3) Load AI evidence if exists
    const evRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/papers/summaries/${pmid}`,
      { cache: "no-store" }
    ).catch(() => null);

    const ev = evRes?.ok ? ((await evRes.json()) as Evidence) : null;
    setEvidence(ev);

    setLoading(false);
  }, [pmid]);

  // Trigger summarize
  const handleSummarize = async () => {
    setSummarizing(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/papers/summarize/${pmid}`, {
      method: "POST",
    });

    setTimeout(async () => {
      await loadData();
      setSummarizing(false);
    }, 2000);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 text-sm opacity-70">
        Loading paper details…
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

        {/* -------- AI SUMMARY BLOCK -------- */}
        <div className="mt-8 border-t pt-6">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            🔬 AI Mechanistic Summary
          </h2>

          {evidence?.one_sentence ? (
            <div className="space-y-4 text-sm">
              <p className="italic text-slate-700 dark:text-slate-200">
                “{evidence.one_sentence}”
              </p>

              {evidence.technical_summary && (
                <div>
                  <div className="font-medium mb-1">Technical Summary</div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {evidence.technical_summary}
                  </p>
                </div>
              )}

              {evidence.patient_summary && (
                <div>
                  <div className="font-medium mb-1">Patient Summary</div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {evidence.patient_summary}
                  </p>
                </div>
              )}

              {/* ✅ Confidence Bar */}
              <ConfidenceBar confidence={evidence.confidence} />

              {/* ✅ Smart Chip Lists */}
              <SmartChipList items={evidence.mechanisms} title="Mechanisms" />
              <SmartChipList items={evidence.biomarkers} title="Biomarkers" />

              {/* ✅ Last Updated */}
              {evidence.created_at && (
                <div className="text-xs text-slate-400">
                  Updated {new Date(evidence.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-500 italic">
              No AI summary exists yet.
            </div>
          )}

          {/* ✅ Generate Summary (first time) */}
          {!evidence?.one_sentence && internalPaper && (
            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="cursor-pointer mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {summarizing ? "Summarizing…" : "✨ Generate AI Summary"}
            </button>
          )}
        </div>

        {/* ✅ Refresh Summary (if exists) */}
        {evidence?.one_sentence && internalPaper && (
          <div className="mt-4">
            <GenerateEvidenceButton
              pmid={pmid}
              onComplete={() => loadData()}
              label="↻ Refresh Summary"
              variant="refresh"
            />
          </div>
        )}

        {/* ✅ Link to source */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-600 dark:text-blue-400 underline underline-offset-2 cursor-pointer"
          >
            View on Europe PMC →
          </a>
        )}
      </div>
    </div>
  );
}
