export default function ConfidenceBar({ confidence }: { confidence?: number }) {
  if (confidence == null) return null;

  const pct = Math.round(confidence * 100);

  return (
    <div className="mt-3">
      <div className="text-xs text-slate-500 mb-1">Confidence: {pct}%</div>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded">
        <div
          className="h-2 bg-green-500 dark:bg-green-400 rounded transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
