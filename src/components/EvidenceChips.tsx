"use client";

interface EvidenceProps {
  mechanisms?: string[];
  biomarkers?: string[];
  confidence?: number;
}

export default function EvidenceChips({
  mechanisms = [],
  biomarkers = [],
  confidence,
}: EvidenceProps) {
  if (!mechanisms.length && !biomarkers.length) return null;

  return (
    <div className="mt-4 space-y-2">
      {confidence !== undefined && (
        <div className="text-sm opacity-70">
          Confidence: {(confidence * 100).toFixed(0)}%
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {mechanisms.map((m) => (
          <span
            key={m}
            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 rounded-full font-medium hover:opacity-80 transition"
            style={{ cursor: "pointer" }}
            title="Mechanism"
          >
            {m}
          </span>
        ))}

        {biomarkers.map((b) => (
          <span
            key={b}
            className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 rounded-full font-medium hover:opacity-80 transition"
            style={{ cursor: "pointer" }}
            title="Biomarker"
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
