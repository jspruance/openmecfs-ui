/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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
        console.log("Fetched data:", res.data);
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
      !filterMechanism ||
      h.mechanisms?.some(
        (m) => m.toLowerCase() === filterMechanism.toLowerCase()
      );
    const confMatch = h.confidence >= minConfidence;
    return mechMatch && confMatch;
  });

  // 📄 Export CSV functionality
  const handleExportCSV = () => {
    if (filtered.length === 0) return;

    const headers = [
      "Title",
      "Summary",
      "Confidence",
      "Mechanisms",
      "Biomarkers",
      "Citations",
    ];
    const rows = filtered.map((h) => [
      `"${h.title}"`,
      `"${h.summary}"`,
      h.confidence.toFixed(2),
      `"${h.mechanisms?.join(", ")}"`,
      `"${h.biomarkers?.join(", ")}"`,
      `"${h.citations?.join(", ")}"`,
    ]);

    const csvContent =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai_hypotheses.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // 🔗 Share link functionality
  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 mt-2">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-semibold text-gray-900 mb-1 tracking-tight">
            AI-Generated Hypotheses
          </h1>
          <p className="text-gray-500 max-w-2xl text-sm sm:text-base leading-relaxed">
            Machine-generated causal links discovered from ME/CFS research data
            — synthesized by AI from biomarkers, mechanisms, and study evidence.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={handleExportCSV}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition focus:ring-2 focus:ring-blue-300"
          >
            Export CSV
          </button>
          <button
            onClick={handleShare}
            className="cursor-pointer border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg transition"
          >
            Share Link
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 bg-gray-50 border border-gray-200 rounded-xl py-3 px-5 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Mechanism:
          </label>
          <select
            value={filterMechanism}
            onChange={(e) => setFilterMechanism(e.target.value)}
            className="cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition"
          >
            <option value="">All Mechanisms</option>
            <option value="vascular">Vascular</option>
            <option value="immune">Immune</option>
            <option value="mitochondrial">Mitochondrial</option>
            <option value="neuroinflammatory">Neuroinflammatory</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Confidence:
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-40 accent-blue-500 cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            ≥ {(minConfidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Hypothesis Cards */}
      <div className="grid gap-6">
        {filtered.map((h) => (
          <motion.div
            key={h.id}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <h2 className="text-xl font-medium mb-2 text-gray-900">
              {h.title}
            </h2>
            <p className="text-gray-700 mb-3">{h.summary}</p>

            {/* Confidence Bar */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-gray-700">
                Confidence:
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-yellow-400 via-green-500 to-green-600"
                  style={{ width: `${h.confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {(h.confidence * 100).toFixed(0)}%
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {h.mechanisms?.map((m) => (
                <span
                  key={m}
                  className="cursor-default px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                >
                  {m}
                </span>
              ))}
              {h.biomarkers?.map((b) => (
                <span
                  key={b}
                  className="cursor-default px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="text-xs text-gray-500 mt-2">
              Cited in: {h.citations?.join(", ") || "—"}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          <div className="text-6xl mb-2">🧠</div>
          <p className="font-medium text-gray-700">
            No hypotheses match your filters.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting confidence or selecting a different mechanism.
          </p>
        </div>
      )}
    </div>
  );
}
