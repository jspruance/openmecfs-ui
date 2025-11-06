"use client";

import { useEffect, useState } from "react";

interface Biomarker {
  biomarker: string;
  count: number;
  mechanisms: string[];
}

export default function BiomarkersPage() {
  const [data, setData] = useState<Biomarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/biomarkers`)
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-slate-500">
        Loading biomarkers…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Biomarkers</h1>
      <p className="text-slate-600 mb-6 max-w-3xl">
        Key biological markers reported in ME/CFS studies, grouped by underlying
        mechanisms. Data are aggregated automatically from AI evidence and
        manually curated research sources.
      </p>

      <div className="grid gap-4">
        {data.map((b) => (
          <div
            key={b.biomarker}
            className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg text-slate-900">
                {b.biomarker}
              </h2>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {b.count} papers
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-700">
              <span className="font-medium text-slate-600">Mechanisms:</span>{" "}
              {b.mechanisms.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
