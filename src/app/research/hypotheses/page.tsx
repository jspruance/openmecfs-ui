/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import axios from "axios";

interface Hypothesis {
  id: string;
  title: string;
  summary: string;
  confidence: number;
  mechanisms: string[];
  biomarkers: string[];
  citations: string[];
  source?: string;
  created_at?: string;
}

const PAGE_SIZE = 10;

function AIHypothesesPageContent() {
  const [data, setData] = useState<Hypothesis[]>([]);
  const [visible, setVisible] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterMechanism, setFilterMechanism] = useState("");
  const [minConfidence, setMinConfidence] = useState(0);
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fetch all data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/ai/hypotheses`
        );
        setData(res.data);
        setVisible(res.data.slice(0, PAGE_SIZE));
      } catch (err: any) {
        console.error("Error fetching hypotheses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Infinite scroll observer
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, loading, loadingMore]);

  const loadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const start = (nextPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const next = data.slice(0, end);
      setVisible(next);
      setPage(nextPage);
      setLoadingMore(false);
    }, 600);
  };

  const filtered = visible.filter((h) => {
    const mechMatch =
      !filterMechanism || h.mechanisms?.includes(filterMechanism);
    const confMatch = h.confidence >= minConfidence;
    return mechMatch && confMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-600 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p>Loading hypotheses...</p>
        </div>
      </div>
    );
  }

  if (error)
    return <p className="p-6 text-red-600">Error loading data: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12">
      <h1 className="text-3xl font-semibold text-center mt-2 mb-2">
        AI-Generated Hypotheses
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        Machine-generated causal links discovered from ME/CFS research data —
        synthesized by AI from biomarkers, mechanisms, and study evidence.
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 justify-center bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 font-medium">
            Mechanism:
          </label>
          <select
            value={filterMechanism}
            onChange={(e) => setFilterMechanism(e.target.value)}
            className="border rounded-lg p-2 bg-white text-gray-800 cursor-pointer"
          >
            <option value="">All Mechanisms</option>
            <option value="vascular">Vascular</option>
            <option value="immune">Immune</option>
            <option value="mitochondrial">Mitochondrial</option>
            <option value="neuroinflammatory">Neuroinflammatory</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 font-medium">
            Confidence:
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-32 cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            ≥ {(minConfidence * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-blue-600 transition cursor-pointer"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
            className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition cursor-pointer"
          >
            Share Link
          </button>
        </div>
      </div>

      {/* Hypothesis cards */}
      <div className="grid gap-6">
        {filtered.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-medium mb-2">{h.title}</h2>
            <p className="text-gray-700 mb-3">{h.summary}</p>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Confidence:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-2"
                  style={{ width: `${h.confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-sm">
                {(h.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {h.mechanisms?.map((m) => (
                <span
                  key={m}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                >
                  {m}
                </span>
              ))}
              {h.biomarkers?.map((b) => (
                <span
                  key={b}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="text-xs text-gray-500 mt-2">
              Cited in: {h.citations?.join(", ") || "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {loadingMore && (
          <div className="rounded-xl border border-gray-200 p-4 text-center text-gray-600">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span className="text-sm">Loading more…</span>
          </div>
        )}

        {!loadingMore && visible.length < data.length && (
          <button
            onClick={loadMore}
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Load more
          </button>
        )}
        <div ref={sentinelRef} className="h-1 w-full" />
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center mt-8">
          No hypotheses match your filters.
        </p>
      )}
    </div>
  );
}

export default function AIHypothesesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex flex-col text-gray-800 font-sans bg-white">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-600 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>Loading hypotheses...</p>
            </div>
          </div>
        </main>
      }
    >
      <AIHypothesesPageContent />
    </Suspense>
  );
}
