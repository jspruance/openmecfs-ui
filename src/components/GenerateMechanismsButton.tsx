"use client";
import { useState } from "react";

export default function GenerateMechanismsButton({
  pmid,
  onDone,
}: {
  pmid: string;
  onDone?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const run = async () => {
    setLoading(true);
    setNote("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/papers/mechanisms/${pmid}`,
        { method: "POST" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Extraction failed");
      setNote("✅ Mechanistic evidence extracted");
      onDone?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setNote(`⚠️ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-3">
      <button
        onClick={run}
        disabled={loading}
        className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg font-medium hover:opacity-80 disabled:opacity-50"
        style={{ cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Extracting…" : "Extract Mechanistic Evidence"}
      </button>
      {note && <div className="text-xs mt-2 opacity-80">{note}</div>}
    </div>
  );
}
