/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Hypothesis {
  id: string;
  title: string;
  summary: string;
  confidence: number;
  mechanisms: string[];
  biomarkers: string[];
  citations: string[];
  created_at: string;
}

export default function AIHypothesesPage() {
  const [data, setData] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterMechanism, setFilterMechanism] = useState("");
  const [minConfidence, setMinConfidence] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/ai/hypotheses`
        );
        setData(res.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading hypotheses…</p>;
  if (error)
    return <p className="p-6 text-red-600">Error loading data: {error}</p>;

  const filtered = data.filter((h) => {
    const mechMatch =
      !filterMechanism || h.mechanisms?.includes(filterMechanism);
    const confMatch = h.confidence >= minConfidence;
    return mechMatch && confMatch;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        AI-Generated Hypotheses
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
        <select
          value={filterMechanism}
          onChange={(e) => setFilterMechanism(e.target.value)}
          className="border rounded-lg p-2 bg-white text-gray-800"
        >
          <option value="">All Mechanisms</option>
          <option value="vascular">Vascular</option>
          <option value="immune">Immune</option>
          <option value="mitochondrial">Mitochondrial</option>
          <option value="neuroinflammatory">Neuroinflammatory</option>
        </select>

        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={minConfidence}
          onChange={(e) => setMinConfidence(Number(e.target.value))}
          className="w-40"
        />
        <span className="text-sm text-gray-600">
          Confidence ≥ {minConfidence.toFixed(1)}
        </span>
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

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center mt-8">
          No hypotheses match your filters.
        </p>
      )}
    </div>
  );
}
