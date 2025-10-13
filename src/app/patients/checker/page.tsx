"use client";
import { useMemo, useState } from "react";

type Ans = "yes" | "no" | "unsure";
const Q = [
  {
    key: "duration",
    text: "Have symptoms substantially reduced your activity for ≥ 6 months?",
  },
  {
    key: "pem",
    text: "Do you experience Post-Exertional Malaise (PEM) after minor physical/mental effort?",
  },
  {
    key: "sleep",
    text: "Do you have unrefreshing sleep (sleep doesn’t restore energy)?",
  },
  {
    key: "cog_or_oi",
    text: "Do you have cognitive impairment (e.g., brain fog) OR orthostatic intolerance (worse when upright)?",
  },
];

export default function CheckerPage() {
  const [ans, setAns] = useState<Record<string, Ans>>({});

  const score = useMemo(() => {
    const y = (k: string) => ans[k] === "yes";
    return {
      iomLikely: y("duration") && y("pem") && y("sleep") && y("cog_or_oi"),
      answeredAll: Q.every((q) => ans[q.key]),
    };
  }, [ans]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Do I have ME/CFS?</h1>
      <p className="mt-2 text-gray-700">
        This short educational checklist mirrors the 2015 IOM/NAM clinical
        criteria. It <strong>cannot diagnose</strong> you; it helps you discuss
        symptoms with a clinician.
      </p>

      <div className="mt-6 space-y-4">
        {Q.map((q) => (
          <div key={q.key} className="rounded-lg border border-gray-200 p-4">
            <p className="font-medium text-gray-900">{q.text}</p>
            <div className="mt-3 flex gap-2">
              {(["yes", "no", "unsure"] as Ans[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAns((a) => ({ ...a, [q.key]: opt }))}
                  className={
                    "px-3 py-1.5 rounded-md border text-sm cursor-pointer " +
                    (ans[q.key] === opt
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:bg-gray-50")
                  }
                >
                  {opt[0].toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Result */}
      <div className="mt-6 rounded-xl border border-gray-200 p-5 bg-gray-50">
        {!score.answeredAll ? (
          <p className="text-gray-700">
            Answer all questions to see a summary based on the IOM criteria.
          </p>
        ) : score.iomLikely ? (
          <div>
            <p className="font-semibold text-green-700">
              Your answers are consistent with the IOM screening pattern.
            </p>
            <p className="mt-1 text-gray-700 text-sm">
              Consider discussing your symptoms with a clinician familiar with
              ME/CFS and orthostatic intolerance.
            </p>
            <a
              href="/patients/doctors"
              className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline"
            >
              Find clinicians & centers →
            </a>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-amber-700">
              Your answers do not match the full IOM screening pattern.
            </p>
            <p className="mt-1 text-gray-700 text-sm">
              You may still have significant health concerns worth evaluating.
              Consider a general medical workup and reading about related
              conditions (e.g., OI/POTS, sleep disorders).
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Educational tool — not medical advice or diagnosis.
      </p>
    </div>
  );
}
