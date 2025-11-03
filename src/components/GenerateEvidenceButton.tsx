"use client";

import { useState } from "react";

interface Props {
  pmid: string;
  onComplete: () => void;
}

export default function GenerateEvidenceButton({ pmid, onComplete }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "cached" | "done" | "error">(
    "idle"
  );

  const handleClick = async () => {
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/papers/summarize/${pmid}`,
        { method: "POST" }
      );

      if (res.status === 409) {
        setStatus("cached");
      } else if (!res.ok) {
        setStatus("error");
      } else {
        setStatus("done");
      }

      onComplete?.();
    } catch (e) {
      console.error("Evidence generation failed:", e);
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <div className="my-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg font-medium hover:opacity-80 disabled:opacity-50"
        style={{ cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Generating..." : "Generate Mechanistic Evidence"}
      </button>

      {status === "cached" && (
        <div className="text-xs text-yellow-500 mt-2">
          ✅ Already generated (cached)
        </div>
      )}

      {status === "done" && (
        <div className="text-xs text-green-500 mt-2">✅ Evidence generated</div>
      )}

      {status === "error" && (
        <div className="text-xs text-red-500 mt-2">❌ Error — try again</div>
      )}
    </div>
  );
}
