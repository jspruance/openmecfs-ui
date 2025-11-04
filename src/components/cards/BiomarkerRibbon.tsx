"use client";

import { useEffect, useState } from "react";

interface BiomarkerCount {
  biomarker: string;
  count: number;
}

export default function BiomarkerRibbon() {
  const [items, setItems] = useState<BiomarkerCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/biomarker_counts?limit=12`)
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Key Biomarkers</h3>

      {loading && <div className="text-sm text-gray-500">Loading...</div>}

      <div className="flex flex-wrap gap-2">
        {!loading &&
          items.map((b) => (
            <span
              key={b.biomarker}
              className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200"
            >
              {b.biomarker} <span className="text-gray-400">({b.count})</span>
            </span>
          ))}
      </div>
    </div>
  );
}
