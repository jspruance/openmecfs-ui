"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Search, ArrowRight } from "lucide-react";

interface Paper {
  pmid: string;
  title: string;
  authors: string[];
  year?: number;
  patient_summary?: string;
}

export default function ResearchPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("year");
  const [selectedTopic, setSelectedTopic] = useState("");

  // 🧩 Unified fetch function with query, sort, and topic
  const fetchPapers = async (q = "", sortValue = "year", topic = "") => {
    setLoading(true);
    try {
      const endpoint = `/papers?q=${encodeURIComponent(
        q
      )}&sort=${sortValue}&topic=${encodeURIComponent(topic)}&limit=10`;
      const res = await api.get(endpoint);
      const result = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setPapers(result);
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPapers(query, sort, selectedTopic);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* 🧠 Header */}
      <section className="text-center mt-10 mb-6 px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Open ME/CFS <span className="text-blue-600">Research Explorer</span>
        </h2>
        <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
          Explore summarized ME/CFS research using AI-powered search and
          semantic discovery.
        </p>

        {/* 🔍 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-md mx-auto mt-5 flex items-center bg-white border border-gray-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition"
        >
          <Search className="ml-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search ME/CFS research..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 py-2.5 px-3 text-sm bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            className="m-1 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* 🔽 Filter Bar */}
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              fetchPapers(query, e.target.value, selectedTopic);
            }}
            className="border border-gray-300 bg-white rounded-md px-3 pr-6 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none relative"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 20 20'%3E%3Cpath fill='gray' d='M6 8l4 4 4-4H6z'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.8rem center",
              backgroundSize: "0.8rem",
            }}
          >
            <option value="year">Newest</option>
            <option value="title">Title (A–Z)</option>
          </select>

          {/* Topic Buttons */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            {[
              "Long COVID",
              "Neurology",
              "Immunology",
              "Diagnostics",
              "Treatment",
            ].map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  const newTopic = selectedTopic === topic ? "" : topic;
                  setSelectedTopic(newTopic);
                  fetchPapers(query, sort, newTopic);
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-150 shadow-sm cursor-pointer ${
                  selectedTopic === topic
                    ? "bg-blue-100 text-blue-700 border-blue-300 shadow-md scale-[1.01]"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                {topic}
              </button>
            ))}
            {selectedTopic && (
              <button
                onClick={() => {
                  setSelectedTopic("");
                  fetchPapers(query, sort, "");
                }}
                className="text-sm text-gray-500 underline ml-2 cursor-pointer hover:text-gray-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 📄 Results */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse text-sm">
            Loading papers...
          </p>
        ) : papers.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">No results found.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {papers.map((paper) => (
              <li
                key={paper.pmid}
                className="group bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                onClick={() => window.open(`/paper/${paper.pmid}`, "_blank")}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900 text-base group-hover:text-blue-600 leading-snug transition-colors">
                    {paper.title}
                  </h3>
                  {/* 🏷️ Year Badge */}
                  {paper.year && (
                    <span className="ml-2 text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md shrink-0">
                      {paper.year}
                    </span>
                  )}
                  <ArrowRight
                    className="text-gray-300 group-hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 ml-2"
                    size={16}
                  />
                </div>

                <p className="text-xs italic text-gray-500 mt-1.5 leading-snug">
                  {Array.isArray(paper.authors)
                    ? paper.authors.join(", ")
                    : paper.authors}
                </p>

                {paper.patient_summary && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {paper.patient_summary}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
