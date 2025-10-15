// src/app/providers/quick-start/CopyBlockClient.tsx
"use client";

import { ClipboardCopy } from "lucide-react";

export default function CopyBlock({
  label,
  text = "",
}: {
  label: string;
  text?: string;
}) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore copy errors silently
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <button
          onClick={onCopy}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:bg-white hover:shadow-sm"
          type="button"
        >
          <ClipboardCopy className="h-3.5 w-3.5" /> Copy
        </button>
      </div>
      <pre className="mt-2 whitespace-pre-wrap text-[13px] leading-5 text-slate-700">
        {text}
      </pre>
    </div>
  );
}
