export interface Mechanism {
  id: string;
  icon: string;
  title: string;
  evidence: "STRONG" | "MODERATE" | "EMERGING";
  findingSummary: string;
  findings: string[];
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
  },
];
