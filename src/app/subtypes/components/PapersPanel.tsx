"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Paper = {
  id: string;
  title: string;
  abstract_summary: string;
  year?: number;
  authors?: string;
};

interface Props {
  clusterId: number | null;
}

export default function PapersPanel({ clusterId }: Props) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clusterId === null) return;

    const fetchPapers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/papers-sb?cluster=${clusterId}`
        );
        if (!res.ok) throw new Error("Failed to fetch papers");
        const data = await res.json();
        setPapers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [clusterId]);

  if (clusterId === null) {
    return (
      <div className="flex items-center justify-center h-full border rounded-xl text-gray-500">
        Select a subtype to view related papers
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Papers in Subtype {clusterId}</h2>
      {papers.length === 0 && (
        <p className="text-gray-500 italic">
          No papers found for this cluster.
        </p>
      )}

      {papers.map((paper) => (
        <Card key={paper.id} className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {paper.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-2">
              {paper.abstract_summary || "No summary available"}
            </p>
            <p className="text-xs text-gray-500">
              {paper.authors ? `${paper.authors}` : ""}{" "}
              {paper.year ? `(${paper.year})` : ""}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
