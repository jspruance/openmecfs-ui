"use client";

import { Mechanism } from "../../data";

export default function MechanismCard({ mech }: { mech: Mechanism }) {
  const evidenceColor =
    mech.evidence === "STRONG"
      ? "bg-green-100 text-green-700"
      : mech.evidence === "MODERATE"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700"; // EMERGING

  return (
    <div className="border rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{mech.icon}</span>
        <h3 className="font-semibold text-lg">{mech.title}</h3>
      </div>

      <span className={`text-xs px-2 py-1 rounded-md ${evidenceColor}`}>
        {mech.evidence} Evidence
      </span>

      <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
        {mech.findingSummary}
      </p>

      <div className="mt-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Key Findings:
        </p>
        <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300 space-y-1">
          {mech.findings.slice(0, 3).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
