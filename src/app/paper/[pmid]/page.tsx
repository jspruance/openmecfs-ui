"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Paper {
  pmid: string;
  title: string;
  authors: string[];
  year?: number;
  abstract?: string;
  technical_summary?: string;
  patient_summary?: string;
  metadata?: any;
}

export default function PaperPage() {
  const { pmid } = useParams();
  const router = useRouter();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pmid) return;
    const fetchPaper = async () => {
      try {
        const res = await api.get(`/papers/${pmid}`);
        setPaper(res.data.paper || res.data);
      } catch (error) {
        console.error("Error loading paper:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [pmid]);

  // 🌀 Loading
  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading paper details...
      </main>
    );

  // ⚠️ Not found
  if (!paper)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p>Paper not found.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition"
        >
          Go Back
        </button>
      </main>
    );

  // ✅ Main content
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 relative">
      {/* 🔙 Floating back button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-24 left-6 flex items-center text-gray-500 hover:text-sky-600 transition bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {/* 📄 Paper Content */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-[1.85rem] font-semibold text-gray-900 mb-3 leading-snug">
          {paper.title}
        </h2>

        <p className="text-sm italic text-gray-500 mb-6">
          {Array.isArray(paper.authors)
            ? paper.authors.join(", ")
            : paper.authors}
          {paper.year ? ` — ${paper.year}` : ""}
        </p>

        <div className="space-y-8">
          {paper.abstract && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <h3 className="text-gray-700 font-medium mb-2">Abstract</h3>
              <p className="text-gray-700 leading-relaxed text-[0.95rem]">
                {paper.abstract}
              </p>
            </div>
          )}

          {paper.technical_summary && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <h3 className="text-gray-700 font-medium mb-2">
                Technical Summary
              </h3>
              <p className="text-gray-700 leading-relaxed text-[0.95rem]">
                {paper.technical_summary}
              </p>
            </div>
          )}

          {paper.patient_summary && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <h3 className="text-gray-700 font-medium mb-2">
                Patient-Friendly Summary
              </h3>
              <p className="text-gray-700 leading-relaxed text-[0.95rem]">
                {paper.patient_summary}
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h3 className="text-gray-700 font-medium mb-2">Metadata</h3>
            <pre className="bg-gray-50 text-xs p-3 rounded-lg overflow-x-auto text-gray-600">
              {JSON.stringify(paper.metadata || {}, null, 2)}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
