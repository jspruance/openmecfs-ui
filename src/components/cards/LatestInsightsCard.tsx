"use client";

import { useEffect, useState } from "react";

interface Insight {
  paper_pmid: string;
  one_sentence: string;
  confidence?: number;
}

export default function LatestInsightsCard() {
  const [items, setItems] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/papers/summaries/recent?limit=5`)
      .then((r) => r.json())
      .then((res) => {
        // Safely extract array whether backend returns [] or {data: []}
        const rows = Array.isArray(res) ? res : res.data ?? [];
        setItems(rows);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">
        Latest Mechanistic Insights
      </h3>

      {loading && <div className="text-sm text-gray-500">Loading...</div>}

      {!loading && items.length === 0 && (
        <div className="text-sm text-gray-500">No insights yet.</div>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.paper_pmid} className="text-sm">
            <a
              href={`/papers/${item.paper_pmid}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {item.paper_pmid}
            </a>
            <div className="text-gray-700">{item.one_sentence}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
