"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Search } from "lucide-react";
import Link from "next/link";

interface Paper {
  pmid: string;
  title: string;
  authors: string[] | string;
  year: number;
}

export default function HomePage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPapers = async (q = "") => {
    setLoading(true);
    try {
      const endpoint = q
        ? `/papers/search?q=${encodeURIComponent(q)}`
        : "/papers?limit=10";
      const res = await api.get(endpoint);
      const result = Array.isArray(res.data)
        ? res.data
        : res.data.papers || res.data.results || [];
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
    fetchPapers(query);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Open ME/CFS Research Explorer
        </h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 mb-8 max-w-xl mx-auto"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search ME/CFS research..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Results */}
        {loading ? (
          <p className="text-center text-gray-500">Loading papers...</p>
        ) : papers.length === 0 ? (
          <p className="text-center text-gray-500">No results found.</p>
        ) : (
          <ul className="grid gap-4">
            {papers.map((paper) => {
              // Normalize authors (handle list or string)
              const authors =
                typeof paper.authors === "string"
                  ? paper.authors
                  : (paper.authors || []).join(", ");

              return (
                <Link
                  key={paper.pmid}
                  href={`/paper/${paper.pmid}`}
                  className="block p-5 border rounded-xl bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer"
                >
                  <h2 className="font-semibold text-lg text-gray-800 leading-snug">
                    {paper.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-1">
                    <span className="italic">{authors}</span>
                    {paper.year && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs ml-1">
                        {paper.year}
                      </span>
                    )}
                  </p>
                </Link>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
