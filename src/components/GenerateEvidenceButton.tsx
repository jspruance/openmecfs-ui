"use client";

import { useState } from "react";

interface Props {
  paperId: string;
  onComplete: () => void;
}

export default function GenerateEvidenceButton({ paperId, onComplete }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "cached" | "done">("idle");

  const handleClick = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/evidence/papers/${paperId}/generate`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.status === "cached") setStatus("cached");
      else setStatus("done");

      onComplete();
    } catch (e) {
      console.error("Evidence generation failed:", e);
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
          ✅ Evidence already generated
        </div>
      )}

      {status === "done" && (
        <div className="text-xs text-green-500 mt-2">
          ✅ Evidence generated successfully
        </div>
      )}
    </div>
  );
}
