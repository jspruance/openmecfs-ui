export default function TreatmentsPage() {
  const treatments = [
    {
      name: "Low-Dose Naltrexone (LDN)",
      mechanism: "Immune modulation, neuroinflammation",
      evidence:
        "Multiple small uncontrolled studies and patient reports suggest symptom improvement via microglial and TLR4 modulation.",
      status: "Investigational / Off-label",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/35752706/",
        "https://pubmed.ncbi.nlm.nih.gov/31203646/",
      ],
    },
    {
      name: "Rituximab",
      mechanism: "B-cell depletion (anti-CD20)",
      evidence:
        "Initial pilot trials were positive, but two large randomized controlled trials failed to show benefit.",
      status: "Discontinued (negative RCTs)",
      references: ["https://pubmed.ncbi.nlm.nih.gov/30901423/"],
    },
    {
      name: "Mestinon (Pyridostigmine)",
      mechanism: "Autonomic modulation via acetylcholinesterase inhibition",
      evidence:
        "Used off-label for orthostatic intolerance / POTS; small open-label studies in ME/CFS show improved orthostatic tolerance.",
      status: "Off-label",
      references: ["https://pubmed.ncbi.nlm.nih.gov/35027354/"],
    },
    {
      name: "Ampligen (Rintatolimod)",
      mechanism: "Toll-like receptor 3 agonist (immunomodulator)",
      evidence:
        "Phase III trials demonstrated modest improvement in a subset of patients; approved in Argentina but not the US/EU.",
      status: "Investigational",
      references: ["https://pubmed.ncbi.nlm.nih.gov/23273713/"],
    },
    {
      name: "Cognitive Behavioral Therapy (CBT) & Graded Exercise Therapy (GET)",
      mechanism: "Behavioral / energy management",
      evidence:
        "Formerly recommended; multiple re-analyses show poor efficacy and potential harm; now deprecated in major guidelines.",
      status: "Deprecated",
      references: [
        "https://www.nice.org.uk/guidance/ng206",
        "https://pubmed.ncbi.nlm.nih.gov/29087232/",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Treatments</h1>
      <p className="text-slate-600 mb-6 max-w-3xl">
        This section summarizes proposed and studied treatments for ME/CFS,
        their mechanisms of action, and current evidence status. Evidence
        summaries are not medical advice.
      </p>

      <div className="grid gap-4">
        {treatments.map((t) => (
          <div
            key={t.name}
            className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg text-slate-900">{t.name}</h2>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  t.status.includes("Investigational")
                    ? "bg-yellow-100 text-yellow-700"
                    : t.status.includes("Off-label")
                    ? "bg-blue-100 text-blue-700"
                    : t.status.includes("Discontinued") ||
                      t.status.includes("Deprecated")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {t.status}
              </span>
            </div>

            <div className="mt-1 text-sm text-slate-600 italic">
              {t.mechanism}
            </div>

            <p className="mt-3 text-sm text-slate-700">{t.evidence}</p>

            {t.references && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {t.references.map((r, i) => (
                  <a
                    key={i}
                    href={r}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Reference {i + 1} →
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
