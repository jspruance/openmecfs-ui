"use client";
import { useEffect, useState } from "react";

interface Biomarker {
  biomarker: string;
  count: number;
  mechanisms: string[];
}

export default function BiomarkersPage() {
  const [data, setData] = useState<Biomarker[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/biomarkers/`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to load biomarkers (${res.status})`);
        return res.json();
      })
      .then((json: Biomarker[]) => setData(json))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Biomarkers</h1>
      <p className="text-slate-600 mb-6 max-w-3xl">
        Key biological markers reported in ME/CFS studies, grouped by underlying
        mechanisms. Data are aggregated automatically from AI evidence and
        manually curated research sources.
      </p>

      {error && <p className="text-red-600">{error}</p>}
      {data.length === 0 && !error && (
        <p className="text-slate-500 italic">
          Loading biomarkers or no data found...
        </p>
      )}

      <div className="grid gap-4">
        {data.map((b) => (
          <div
            key={b.biomarker}
            className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <h3 className="font-semibold text-slate-900">{b.biomarker}</h3>
            <p className="text-sm text-slate-600 mt-1">
              Reported in {b.count} studies
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Mechanisms:{" "}
              <span className="italic">{b.mechanisms.join(", ")}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
