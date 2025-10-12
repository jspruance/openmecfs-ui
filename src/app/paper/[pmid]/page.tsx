"use client";

import { useEffect, useState, Fragment } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Tab } from "@headlessui/react";
import { Loader2, ArrowLeft } from "lucide-react";

interface Paper {
  pmid: string;
  title: string;
  authors: string[];
  year?: number;
  abstract?: string;
  technical_summary?: string;
  patient_summary?: string;
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
      {/* Back Button – positioned just below the navbar */}
      <div className="absolute top-[72px] left-[40px]">
        {/* Back Button — below navbar and guaranteed clickable */}
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/"); // fallback to home if no history
            }
          }}
          className="absolute top-[72px] left-[40px] z-[2000] flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-200 cursor-pointer transition-colors"
          style={{ pointerEvents: "auto" }}
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Page Content */}
      <div className="max-w-3xl mx-auto p-6 pt-14">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">{paper.title}</h1>
          <p className="text-sm text-gray-700 mb-1">
            {paper.authors?.join(", ")}
          </p>
          <p className="text-sm text-gray-500">
            {paper.year ? `(${paper.year})` : ""} — PMID: {paper.pmid}
          </p>
          <a
            href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            View on PubMed →
          </a>
        </div>

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
              <p className="whitespace-pre-line leading-relaxed text-gray-800">
                {paper.patient_summary || "No patient summary available."}
              </p>
            </Tab.Panel>
            <Tab.Panel>
              <p className="whitespace-pre-line leading-relaxed text-gray-800">
                {paper.technical_summary || "No technical summary available."}
              </p>
            </Tab.Panel>
            <Tab.Panel>
              <p className="whitespace-pre-line leading-relaxed text-gray-800">
                {paper.abstract || "No abstract available."}
              </p>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Fragment>
  );
}
