"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface Paper {
  pmid: string;
  title: string;
  authors: string[] | string;
  year?: number;
  patient_summary?: string;
}

const topicMap: Record<string, string> = {
  "Long COVID": "long covid",
  Neurology: "neurology",
  Immunology: "immunology",
  Diagnostics: "diagnos",
  Treatment: "treat",
};

const LIMIT = 10;

function highlight(text: string, query: string) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, `<mark class="bg-yellow-200">$1</mark>`);
}

function ResearchPapersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [sort, setSort] = useState(() => searchParams.get("sort") || "year");
  const [selectedTopic, setSelectedTopic] = useState(
    () => searchParams.get("topic") || ""
  );

  const [papers, setPapers] = useState<Paper[]>([]);
  const [page, setPage] = useState(() => Number(searchParams.get("page") || 1));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const endpoint = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    const usp = new URLSearchParams();

    if (query) usp.set("q", query);
    if (sort) usp.set("sort", sort);
    if (selectedTopic) usp.set("topic", selectedTopic);

    usp.set("limit", String(LIMIT));
    usp.set("page", String(page));

    // ✅ Always use `/papers-sb/`
    return `${base}/papers-sb/?${usp.toString()}`;
  }, [query, sort, selectedTopic, page]);

  const pushUrl = useCallback(
    (next: { q?: string; sort?: string; topic?: string; page?: number }) => {
      const usp = new URLSearchParams(window.location.search);

      if (next.q !== undefined) {
        if (next.q) usp.set("q", next.q);
        else usp.delete("q");
      }
      if (next.sort !== undefined) usp.set("sort", next.sort);
      if (next.topic !== undefined) {
        if (next.topic) usp.set("topic", next.topic);
        else usp.delete("topic");
      }
      if (next.page !== undefined) usp.set("page", String(next.page));

      router.replace(`?${usp.toString()}`, { scroll: false });
    },
    [router]
  );

  const fetchPage = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      const json = await res.json();
      const batch = json.data || [];
      const more = json.has_more ?? batch.length === LIMIT;

      setPapers((prev) => (page === 1 ? batch : [...prev, ...batch]));
      setHasMore(more);
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, loading, hasMore]);

  // ✅ One-time init from URL, THEN fetch
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      setPapers([]);
      setHasMore(true);
      return;
    }
    fetchPage();
  }, [endpoint, initialized, fetchPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          pushUrl({ page: nextPage });
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [page, hasMore, loading, pushUrl]);

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPapers([]);
    setHasMore(true);
    setPage(1);
    pushUrl({ q: query, sort, topic: selectedTopic, page: 1 });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPapers([]);
    setHasMore(true);
    setPage(1);
    pushUrl({ sort: value, page: 1 });
  };

  return (
    <main className="min-h-screen flex flex-col text-gray-800 font-sans bg-white">
      {/* ✅ Hero */}
      <section className="w-full border-b border-transparent">
        <div className="max-w-5xl mx-auto px-6 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            ME/CFS Research Explorer
          </h1>

          <p className="mt-2 text-[15px] text-gray-600 max-w-2xl leading-relaxed">
            Search, filter, and explore structured ME/CFS literature — powered
            by AI summaries.
          </p>

          {/* Search */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3 w-full">
            <form
              onSubmit={handleSubmitSearch}
              className="flex flex-1 items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-brand"
            >
              <Search className="ml-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search ME/CFS research…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 py-2.5 px-3 text-sm bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="m-1 px-4 py-2 text-sm font-medium text-white rounded-md bg-brand hover:bg-brand-dark transition"
              >
                Search
              </button>
            </form>

            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-[140px] border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:ring-brand focus:outline-none cursor-pointer"
            >
              <option value="year">Newest</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </div>

          {/* Topic Filters */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {Object.keys(topicMap).map((label) => {
              const mapped = topicMap[label];
              const isActive = selectedTopic === mapped;

              return (
                <button
                  key={label}
                  onClick={() => {
                    const newTopic = isActive ? "" : mapped;
                    setSelectedTopic(newTopic);
                    setPapers([]);
                    setHasMore(true);
                    setPage(1);
                    pushUrl({ topic: newTopic, page: 1 });
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border cursor-pointer transition ${
                    isActive
                      ? "bg-blue-100 text-brand border-brand"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-brand"
                  }`}
                >
                  {label}
                </button>
              );
            })}

            {selectedTopic && (
              <button
                onClick={() => {
                  setSelectedTopic("");
                  setPapers([]);
                  setHasMore(true);
                  setPage(1);
                  pushUrl({ topic: "", page: 1 });
                }}
                className="text-sm text-gray-500 underline ml-1 hover:text-gray-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ✅ Results */}
      <section className="max-w-4xl mx-auto px-6 pb-12 pt-4">
        {papers.length === 0 && loading ? (
          <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-600 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p>Loading papers…</p>
          </div>
        ) : papers.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">No results found.</p>
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {papers.map((paper) => (
                <li
                  key={paper.pmid}
                  className="group bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
                  onClick={() =>
                    window.open(`/research/papers/${paper.pmid}`, "_blank")
                  }
                >
                  <div className="flex items-start justify-between">
                    <h3
                      className="font-medium text-gray-900 text-base group-hover:text-brand leading-snug transition-colors"
                      dangerouslySetInnerHTML={{
                        __html: highlight(paper.title, query),
                      }}
                    />
                    {paper.year && (
                      <span className="ml-2 text-xs font-semibold bg-blue-100 text-brand px-2 py-0.5 rounded-md shrink-0">
                        {paper.year}
                      </span>
                    )}
                    <ArrowRight
                      className="text-gray-300 group-hover:text-brand opacity-0 group-hover:opacity-100 ml-2"
                      size={16}
                    />
                  </div>

                  <p className="text-xs italic text-gray-500 mt-1.5">
                    {Array.isArray(paper.authors)
                      ? paper.authors.join(", ")
                      : paper.authors}
                  </p>

                  {paper.patient_summary && (
                    <p
                      className="text-sm text-gray-600 mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: highlight(paper.patient_summary, query),
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>

            {/* Infinite scroll sentinel */}
            <div className="mt-6 flex flex-col items-center gap-3">
              {loading && (
                <div className="rounded-xl border border-gray-200 p-4 text-center text-gray-600">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span className="text-sm">Loading more…</span>
                </div>
              )}
              {!loading && hasMore && (
                <button
                  onClick={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    pushUrl({ page: nextPage });
                  }}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  Load more
                </button>
              )}
              <div ref={sentinelRef} className="h-1 w-full" />
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default function ResearchPapersPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex flex-col text-gray-800 font-sans bg-white">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-600 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>Loading papers...</p>
            </div>
          </div>
        </main>
      }
    >
      <ResearchPapersPageContent />
    </Suspense>
  );
}
