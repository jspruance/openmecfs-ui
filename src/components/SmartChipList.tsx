"use client";
import { useState } from "react";

export default function SmartChipList({
  items = [],
  title,
}: {
  items?: string[];
  title: string;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!items.length) return null;

  const max = 4;
  const visible = expanded ? items : items.slice(0, max);
  const remaining = items.length - max;

  return (
    <div className="mt-3">
      <div className="text-xs text-slate-500 mb-1">{title}</div>
      <div className="flex flex-wrap gap-2">
        {visible.map((tag) => (
          <span
            key={tag}
            className="
              cursor-pointer px-2 py-1 text-xs rounded-full 
              bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300
              hover:opacity-80 transition
            "
          >
            {tag}
          </span>
        ))}

        {!expanded && remaining > 0 && (
          <button
            className="text-xs text-slate-500 underline cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            +{remaining} more
          </button>
        )}
      </div>
    </div>
  );
}
