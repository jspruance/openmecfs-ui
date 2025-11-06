export default function TreatmentsPage() {
  const treatments = [
    // --- ACTIVE & INVESTIGATIONAL ---
    {
      name: "Low-Dose Naltrexone (LDN)",
      mechanism: "Immune modulation, microglial suppression (TLR4 antagonist)",
      evidence:
        "Multiple open-label and mechanistic studies suggest LDN may reduce pain, fatigue, and neuroinflammatory signaling in ME/CFS. Mechanistically, it may calm microglial activation and normalize immune function.",
      status: "Investigational / Off-label",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/32590234/", // Anderson 2020 – LDN for ME/CFS
        "https://pubmed.ncbi.nlm.nih.gov/34177527/", // Ng et al 2021 – TRPM3 restoration with LDN
      ],
    },
    {
      name: "Low-Dose Aripiprazole (Abilify)",
      mechanism:
        "Dopamine partial agonist; may modulate central fatigue signaling and neuroinflammation.",
      evidence:
        "A 2021 Stanford retrospective series (n=101) reported functional improvements in ~70% of ME/CFS patients at doses 0.25–2 mg/day, with fatigue and cognitive symptoms most responsive. Controlled trials are planned.",
      status: "Investigational / Off-label",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/33640105/", // Kogelnik et al 2021 – Stanford study
        "https://clinicaltrials.gov/study/NCT06043280", // Planned aripiprazole ME/CFS trial
      ],
    },
    {
      name: "Pyridostigmine (Mestinon)",
      mechanism:
        "Acetylcholinesterase inhibitor; enhances parasympathetic tone and reduces orthostatic intolerance.",
      evidence:
        "Randomized and open-label trials show improved orthostatic tolerance, exercise capacity, and reduced post-exertional symptoms in ME/CFS and POTS subsets.",
      status: "Off-label",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/35526605/", // Systrom 2022 – ME/CFS RCT
        "https://pubmed.ncbi.nlm.nih.gov/33931211/", // Vernino 2021 – autonomic context
      ],
    },
    {
      name: "Midodrine",
      mechanism:
        "Peripheral α-adrenergic agonist; increases venous return and cerebral perfusion in orthostatic intolerance.",
      evidence:
        "Used clinically for POTS and orthostatic hypotension; controlled studies demonstrate improved orthostatic tolerance and symptom reduction in subsets relevant to ME/CFS.",
      status: "Off-label",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/19761935/", // Raj 2009 – POTS RCT
        "https://pubmed.ncbi.nlm.nih.gov/10812393/", // Low 2000 – chronic fatigue & midodrine
      ],
    },
    {
      name: "Fludrocortisone (Florinef)",
      mechanism:
        "Synthetic mineralocorticoid; expands plasma volume and improves cerebral blood flow.",
      evidence:
        "Common first-line therapy for orthostatic intolerance; a controlled trial in ME/CFS showed modest benefit but high interindividual variability. Often used with salt and fluids.",
      status: "Off-label",
      references: ["https://pubmed.ncbi.nlm.nih.gov/11150108/"], // Rowe 2001 – JAMA trial
    },
    {
      name: "Antivirals (Valganciclovir, Famciclovir)",
      mechanism:
        "Target viral reactivation (EBV, HHV-6, CMV) implicated in post-infectious ME/CFS.",
      evidence:
        "Controlled trials show mixed results: Montoya et al. reported improvement in patients with high herpesvirus titers; others found minimal change. Still under investigation.",
      status: "Investigational",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/24020588/", // Montoya 2013 – RCT
        "https://pubmed.ncbi.nlm.nih.gov/20074860/", // Kogelnik 2010 – Stanford antiviral study
      ],
    },
    {
      name: "Ampligen (Rintatolimod)",
      mechanism:
        "Toll-like receptor 3 (TLR3) agonist; modulates innate immunity and RNA antiviral pathways.",
      evidence:
        "Multiple Phase III trials demonstrated modest improvement in exercise tolerance in subsets of ME/CFS patients. Approved for ME/CFS in Argentina; not approved in US/EU.",
      status: "Investigational",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/22427991/", // Strayer 2012 – PLoS One trial
        "https://pubmed.ncbi.nlm.nih.gov/29511709/", // Carter 2018 – review
      ],
    },
    {
      name: "Mitochondrial Supplements (CoQ10, NADH, Carnitine, Riboflavin, etc.)",
      mechanism:
        "Support oxidative phosphorylation and reduce oxidative stress; improve cellular energy metabolism.",
      evidence:
        "Randomized trials and meta-analyses show mild improvements in fatigue and quality of life with low risk. Widely used as supportive therapy.",
      status: "Supportive / Over-the-counter",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/25255384/", // Castro-Marrero 2015 – CoQ10 + NADH RCT
        "https://pubmed.ncbi.nlm.nih.gov/22466036/", // Booth & Myhill 2012 – mito dysfunction
      ],
    },

    // --- DEPRECATED / WITHDRAWN ---
    {
      name: "Rituximab",
      mechanism: "B-cell depletion (anti-CD20 monoclonal antibody).",
      evidence:
        "Initial open-label studies suggested benefit, but large randomized controlled trials failed to show efficacy. The research program was discontinued after the negative phase III trial.",
      status: "Deprecated",
      deprecated: true,
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/30901423/", // Fluge 2019 – negative phase III
        "https://pubmed.ncbi.nlm.nih.gov/22039471/", // Fluge 2011 – initial open-label
      ],
    },
    {
      name: "Cognitive Behavioral Therapy (CBT) & Graded Exercise Therapy (GET)",
      mechanism: "Behavioral / psychological reconditioning.",
      evidence:
        "Previously recommended by older guidelines; subsequent re-analyses and patient surveys revealed minimal efficacy and potential harm. Removed from NICE guidelines (UK, 2021).",
      status: "Deprecated",
      deprecated: true,
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/29087232/", // Wilshire 2017 – PACE reanalysis
        "https://www.nice.org.uk/guidance/ng206", // NICE 2021 guideline
      ],
    },
  ];

  const active = treatments.filter((t) => !t.deprecated);
  const deprecated = treatments.filter((t) => t.deprecated);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Treatments</h1>
      <p className="text-slate-600 mb-6 max-w-3xl">
        This section summarizes proposed and studied treatments for ME/CFS,
        their mechanisms of action, and current evidence status. These summaries
        are for research and educational purposes only and do not constitute
        medical advice.
      </p>

      {/* Active Treatments */}
      <h2 className="text-xl font-semibold mb-3">
        💊 Current & Investigational Treatments
      </h2>
      <div className="grid gap-4 mb-8">
        {active.map((t) => (
          <div
            key={t.name}
            className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-slate-900">{t.name}</h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  t.status.includes("Investigational")
                    ? "bg-yellow-100 text-yellow-800"
                    : t.status.includes("Off-label")
                    ? "bg-blue-100 text-blue-800"
                    : t.status.includes("Supportive")
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {t.status}
              </span>
            </div>
            <div className="mt-1 text-sm text-slate-600 italic">
              {t.mechanism}
            </div>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              {t.evidence}
            </p>
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

      {/* Deprecated Treatments */}
      {deprecated.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3 text-red-700">
            ⚠️ Deprecated / No Longer Recommended
          </h2>
          <div className="grid gap-4">
            {deprecated.map((t) => (
              <div
                key={t.name}
                className="border border-red-200 rounded-lg p-5 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-slate-900">
                    {t.name}
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-700">
                    {t.status}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-600 italic">
                  {t.mechanism}
                </div>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  {t.evidence}
                </p>
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
        </>
      )}
    </div>
  );
}
