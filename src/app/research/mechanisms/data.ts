export interface Mechanism {
  id: string;
  icon: string;
  title: string;
  evidence: "STRONG" | "MODERATE" | "EMERGING";
  findingSummary: string;
  findings: string[];
  papers?: string[]; // PubMed PMIDs (digits only)
}

export const mechanisms: Mechanism[] = [
  {
    id: "neuroinflammation",
    icon: "🧠🔥",
    title: "Neuroinflammation",
    evidence: "MODERATE",
    findingSummary:
      "Chronic activation of microglia and central inflammatory signaling may drive fatigue, cognitive impairment, and sensory hypersensitivity in ME/CFS.",
    findings: [
      "Microglial activation observed in PET imaging",
      "Elevated neuroinflammatory cytokines in CSF",
      "Neuroimmune overlap with Long COVID",
    ],
    // We'll populate with verified PMIDs next pass
    papers: ["26310269", "33200941", "24785653", "26001304", "23407465"],
  },
  {
    id: "autonomic",
    icon: "⚡🩺",
    title: "Autonomic Dysregulation / OI",
    evidence: "STRONG",
    findingSummary:
      "Autonomic imbalance, impaired cerebral blood flow, and orthostatic intolerance are common in ME/CFS, suggesting disruption of autonomic nervous system control.",
    findings: [
      "Reduced cerebral blood flow during tilt-table tests",
      "High prevalence of POTS and orthostatic intolerance",
      "Autonomic symptoms improve with volume/sodium therapy",
    ],
    // ✅ Curated PubMed PMIDs (digits only)
    papers: [
      "32140630", // 2020 van Campen et al. Reduced CBF during tilt (ME/CFS)
      "34667909", // 2021 van Campen et al. CBF recovery after tilt
      "38138257", // 2023 van Campen et al. Severity association with CBF
      "39765993", // 2024 van Campen et al. CO–CBF relationship in ME/CFS
      "29629968", // 2018 van Campen et al. (orthostatic intolerance/POTS context)
    ],
  },
  {
    id: "mitochondria",
    icon: "🧬🔋",
    title: "Mitochondrial Energy Impairment",
    evidence: "EMERGING",
    findingSummary:
      "Impaired ATP production, redox imbalance, and altered metabolic pathways may limit cellular energy availability.",
    findings: [
      "Reduced ATP synthesis in muscle biopsies",
      "Altered redox metabolism and lactate abnormalities",
      "Overlap with metabolic post-viral syndromes",
    ],
    // ✅ Curated PubMed PMIDs
    papers: [
      "30847260", // 2019 Tomas et al. PBMC mitochondrial respiration
      "32041178", // 2020 Missailidis et al. Complex V inefficiency
      "28018972", // 2016 Fluge et al. PDH inhibition signals (JCI Insight)
      "27747291", // 2016 Naviaux et al. Metabolomics “hypometabolic” state
      "27573827", // 2016 Yamano et al. Metabolomic biomarker candidates
    ],
  },
  {
    id: "viral-immune",
    icon: "🛡️🦠",
    title: "Immune Dysfunction & Viral Reactivation",
    evidence: "MODERATE",
    findingSummary:
      "Immune dysregulation and possible herpesvirus reactivation may contribute to chronic symptoms.",
    findings: [
      "Altered NK cell function",
      "Elevated inflammatory cytokines",
      "EBV / HHV-6 reactivation signals in subsets",
    ],
    papers: [
      // next pass; will add Loebel 2014 (EBV early antigen) and NK-cell function papers
    ],
  },
  {
    id: "vascular",
    icon: "💉🧠",
    title: "Neurovascular Dysfunction",
    evidence: "EMERGING",
    findingSummary:
      "Impaired microcirculation and endothelial dysfunction may affect oxygen delivery and cognitive performance.",
    findings: [
      "Reduced cerebral perfusion seen in imaging",
      "Endothelial dysfunction evidence",
      "Hypoperfusion overlaps with Long COVID findings",
    ],
    papers: [
      // next pass; we’ll add additional CBF/brain perfusion PMIDs beyond the autonomic set
    ],
  },
  {
    id: "hpa-axis",
    icon: "🧠⚖️",
    title: "HPA Axis / Hormonal Dysregulation",
    evidence: "EMERGING",
    findingSummary:
      "Altered stress-response signaling and dysregulated cortisol rhythms may contribute to fatigue and immune changes.",
    findings: [
      "Flattened cortisol curve in some patients",
      "HPA axis sensitivity to stress",
      "Possible subset-specific hormonal patterns",
    ],
    papers: [
      // next pass; will add Cleare/Papadopoulos review + CAR/HPA empirical papers with PMIDs
    ],
  },
  {
    id: "microbiome",
    icon: "🦠🌿",
    title: "Gut–Brain–Immune Axis & Microbiome",
    evidence: "MODERATE",
    findingSummary:
      "Gut dysbiosis and microbial translocation may drive systemic inflammation and neuroimmune signaling.",
    findings: [
      "Reduced microbial diversity",
      "Elevated gut-permeability markers",
      "Shared patterns with Long COVID dysbiosis",
    ],
    papers: [
      // next pass; curated PMIDs for dysbiosis/leaky gut markers in ME/CFS
    ],
  },
  {
    id: "oxidative-stress",
    icon: "🧪⚡",
    title: "Oxidative & Nitrosative Stress",
    evidence: "EMERGING",
    findingSummary:
      "Oxidative imbalance may impair cellular metabolism and mitochondrial efficiency.",
    findings: [
      "Elevated oxidative stress markers",
      "Nitrosative stress abnormalities reported",
      "Ties to fatigue & PEM responses",
    ],
    papers: [
      // next pass; curated PMIDs for O&NS signatures in ME/CFS
    ],
  },
];
