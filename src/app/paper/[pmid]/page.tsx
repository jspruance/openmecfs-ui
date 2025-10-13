"use client";

import { useEffect, useState, Fragment } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Tab } from "@headlessui/react";
import { Loader2, ArrowLeft, Share2, Copy, ExternalLink } from "lucide-react";

interface Paper {
  pmid: string;
  title: string;
  authors: string[];
  year?: number;
  journal?: string;
  keywords?: string[];
  patient_summary?: string;
  technical_summary?: string;
  abstract?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PaperDetailPage() {
  const { pmid } = useParams<{ pmid: string }>();
  const router = useRouter();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const res = await api.get(`/papers/${pmid}`);
        setPaper(res.data);
      } catch (error) {
        console.error("Error loading paper:", error);
      } finally {
        setLoading(false);
      }
    };
    if (pmid) fetchPaper();
  }, [pmid]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="p-8 text-center text-gray-600">Paper not found.</div>
    );
  }

  return (
    <Fragment>
      {/* Back Button */}
      <button
        onClick={() => {
          if (window.history.length > 1) router.back();
          else router.push("/");
        }}
        className="absolute top-[72px] left-[40px] z-[2000] flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-200 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Page Content */}
      <div className="max-w-3xl mx-auto p-6 pt-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-2xl font-semibold mb-1">{paper.title}</h1>
            {paper.year && (
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-md self-start">
                {paper.year}
              </span>
            )}
          </div>

          {/* Metadata */}
          <div className="text-sm text-gray-700 space-y-1 mt-1">
            {paper.authors?.length > 0 && (
              <p className="text-gray-700">{paper.authors.join(", ")}</p>
            )}
            {paper.journal && (
              <p className="italic text-gray-600">{paper.journal}</p>
            )}
            <p className="text-gray-500">PMID: {paper.pmid}</p>
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              View on PubMed
            </a>
          </div>

          {/* Keywords */}
          {paper.keywords && paper.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {paper.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Summary Highlight Box */}
        {paper.patient_summary && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-5">
            <p className="text-gray-800 text-sm leading-relaxed">
              {paper.patient_summary.split(".").slice(0, 2).join(".").trim() +
                "."}
            </p>
          </div>
        )}

        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-2 mb-4 border-b border-gray-200">
            {["Patient Summary", "Research Summary", "Original Abstract"].map(
              (tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    classNames(
                      "cursor-pointer px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none transition-colors",
                      selected
                        ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    )
                  }
                >
                  {tab}
                </Tab>
              )
            )}
          </Tab.List>

          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <p className="prose prose-blue max-w-none leading-relaxed text-gray-800">
                {paper.patient_summary || "No patient summary available."}
              </p>
            </Tab.Panel>
            <Tab.Panel>
              <p className="prose prose-blue max-w-none leading-relaxed text-gray-800">
                {paper.technical_summary || "No technical summary available."}
              </p>
            </Tab.Panel>
            <Tab.Panel>
              <p className="prose prose-blue max-w-none leading-relaxed text-gray-800">
                {paper.abstract || "No abstract available."}
              </p>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Share Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md cursor-pointer transition"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </button>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              paper.title
            )}&url=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : ""
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-md transition cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            Share on X
          </a>
        </div>

        {/* Related Studies (future) */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-3">Related Studies</h2>
          <p className="text-sm text-gray-600 italic">
            This section will recommend similar papers once semantic search is
            enabled.
          </p>
        </div>
      </div>
    </Fragment>
  );
}
