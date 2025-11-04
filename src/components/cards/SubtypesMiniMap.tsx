"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scatter = dynamic(() => import("@/components/Subtypes/ScatterPlot"), {
  ssr: false,
});

export default function SubtypesMiniMap() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clusters?limit=300`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm h-64">
      <h3 className="text-lg font-semibold mb-2">
        Biological Subtypes Preview
      </h3>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && (
        <div className="h-[80%] rounded overflow-hidden">
          <Scatter data={data} mini />
        </div>
      )}

      <a
        href="/research/subtypes"
        className="text-xs text-blue-600 mt-1 inline-block hover:underline"
      >
        View full explorer →
      </a>
    </div>
  );
}
