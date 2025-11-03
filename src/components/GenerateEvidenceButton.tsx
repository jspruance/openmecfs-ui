"use client";

import { useState } from "react";

interface Props {
  pmid: string;
  onComplete: () => void;
  label?: string; // optional — used for "↻ Refresh Summary"
}

export default function GenerateEvidenceButton({
  pmid,
  onComplete,
  label,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "cached" | "done" | "error">(
    "idle"
  );

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/papers/summarize/${pmid}`,
        { method: "POST", cache: "no-store" }
      );

      if (res.status === 409) {
        // Summary already exists (hash match)
        setStatus("cached");
      } else if (!res.ok) {
        setStatus("error");
      } else {
        setStatus("done");
      }

      // allow backend to write before refresh
      setTimeout(() => {
        onComplete?.();
      }, 1200);
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
        className="
          cursor-pointer
          inline-flex items-center gap-2
          px-3 py-2 text-sm
          bg-indigo-600 text-white rounded-lg font-medium
          hover:opacity-80 
          disabled:opacity-50 disabled:cursor-not-allowed
          transition
        "
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
              />
            </svg>
            {label ? "Refreshing…" : "Generating…"}
          </>
        ) : (
          label ?? "✨ Generate AI Summary"
        )}
      </button>

      {status === "cached" && (
        <div className="text-xs text-yellow-500 mt-2">
          ✅ Already generated (cached)
        </div>
      )}
      {status === "done" && (
        <div className="text-xs text-green-500 mt-2">✅ Summary updated</div>
      )}
      {status === "error" && (
        <div className="text-xs text-red-500 mt-2">❌ Error — try again</div>
      )}
    </div>
  );
}
