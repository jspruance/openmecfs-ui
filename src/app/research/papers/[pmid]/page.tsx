"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Paper {
  pmid?: string;
  title?: string;
  authors?: string[];
  year?: number;
  journal?: string;
  abstract?: string;
  technical_summary?: string;
  patient_summary?: string;
}

const TABS = [
  { key: "abstract", label: "Abstract" },
  { key: "patient", label: "Patient Summary" },
  { key: "technical", label: "Technical Summary" },
  { key: "metadata", label: "Metadata" },
];

export default function PaperDetailPage() {
  const { pmid } = useParams();
  const router = useRouter();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("abstract");

  useEffect(() => {
    if (!pmid) return;

    const fetchPaper = async () => {
      try {
        const res = await fetch(`/api/papers/${pmid}`);
        const data = await res.json();
        setPaper(data);
      } catch (err) {
        console.error("Failed to fetch paper", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [pmid]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="rounded-xl border border-gray-200 p-8 text-center flex flex-col items-center justify-center text-gray-600">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p>Loading paper…</p>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="p-10 text-center text-gray-500">Paper not found.</div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 text-gray-800">
      {/* Back */}
      <button
        onClick={() => router.push("/research/papers")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Papers
      </button>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900 leading-snug">
        {paper.title}
      </h1>

      {/* Authors / Journal / Year */}
      <div className="text-sm text-gray-600 space-x-3">
        {paper.authors && <span>{paper.authors.join(", ")}</span>}
        {paper.journal && <span>· {paper.journal}</span>}
        {paper.year && (
          <span className="inline-block bg-blue-100 text-brand px-2 py-0.5 rounded-md font-medium ml-1">
            {paper.year}
          </span>
        )}
      </div>

      {/* PubMed link */}
      {paper.pmid && (
        <a
          href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}`}
          target="_blank"
          className="text-sm text-brand underline hover:text-blue-700 cursor-pointer"
        >
          View on PubMed
        </a>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mt-6 flex-wrap">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border cursor-pointer transition-all ${
              activeTab === key
                ? "bg-blue-100 text-brand border-brand shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-brand"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "abstract" && (
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Abstract</h2>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
            {paper.abstract || "No abstract available."}
          </p>
        </div>
      )}

      {/* Tab Content */}
      <div className="mt-4 bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
        {activeTab === "patient" && (
          <div>
            <h2 className="text-lg font-medium text-brand mb-2">
              Patient-Friendly Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {paper.patient_summary || "No patient summary available."}
            </p>
          </div>
        )}

        {activeTab === "technical" && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Technical Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {paper.technical_summary || "No technical summary provided."}
            </p>
          </div>
        )}

        {activeTab === "metadata" && (
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>PMID:</strong> {paper.pmid}
            </p>
            <p>
              <strong>Journal:</strong> {paper.journal}
            </p>
            <p>
              <strong>Year:</strong> {paper.year}
            </p>
            <p>
              <strong>Authors:</strong> {paper.authors?.join(", ")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
