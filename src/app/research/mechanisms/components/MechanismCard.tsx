"use client";

import { Mechanism } from "../data";

export default function MechanismCard({ mech }: { mech: Mechanism }) {
  const evidenceColor =
    mech.evidence_level === "strong"
      ? "bg-green-100 text-green-700"
      : mech.evidence_level === "moderate"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-lg mb-1">{mech.title}</h3>
      <span className={`text-xs px-2 py-1 rounded-md ${evidenceColor}`}>
        {mech.evidence_level.toUpperCase()} Evidence
      </span>

      <p className="text-sm text-gray-600 mt-3">{mech.summary}</p>

      <div className="mt-3">
        <p className="text-xs font-medium text-gray-500 mb-1">Key Findings:</p>
        <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
          {mech.key_findings.slice(0, 3).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
