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
      "Chronic microglial activation, neuroimmune signaling, and inflammatory mediators in CSF and brain imaging indicate central inflammation.",
    findings: [
      "Microglial activation on PET",
      "CSF immune abnormalities",
      "Neuroimmune overlap with Long COVID",
    ],
    papers: ["26310269", "33200941", "24785653", "26001304", "23407465"],
  },

  {
    id: "autonomic",
    icon: "⚡🩺",
    title: "Autonomic Dysregulation / OI",
    evidence: "STRONG",
    findingSummary:
      "Broad evidence for orthostatic intolerance, impaired cerebral blood flow, and autonomic control dysfunction.",
    findings: [
      "Reduced cerebral blood flow",
      "High prevalence of OI/POTS",
      "Symptom improvement with volume support",
    ],
    papers: ["32140630", "34667909", "38138257", "39765993", "29629968"],
  },

  {
    id: "mitochondria",
    icon: "🧬🔋",
    title: "Mitochondrial Energy Impairment",
    evidence: "EMERGING",
    findingSummary:
      "Altered oxidative phosphorylation, PDH inhibition, and hypometabolic cell state in subsets.",
    findings: [
      "Reduced ATP production",
      "Redox abnormalities",
      "Metabolic trap hypothesis support",
    ],
    papers: ["30847260", "32041178", "28018972", "27747291", "27573827"],
  },

  {
    id: "viral-immune",
    icon: "🛡️🦠",
    title: "Immune Dysfunction & Viral Reactivation",
    evidence: "MODERATE",
    findingSummary:
      "Immune exhaustion, NK dysfunction, and herpesvirus activity in subsets.",
    findings: [
      "Low NK cytotoxicity",
      "Herpesvirus reactivation signals",
      "T-cell exhaustion profile",
    ],
    papers: [
      "24781814", // Loebel EBV reactivation
      "16950834", // Fletcher NK dysfunction
      "26700826", // Montoya cytokine abnormalities
      "30385638", // Proal + VanElzakker review, viral persistence hypothesis
      "36027999", // Long COVID parallels, immune exhaustion
    ],
  },

  {
    id: "vascular",
    icon: "💉🧠",
    title: "Neurovascular Dysfunction",
    evidence: "EMERGING",
    findingSummary:
      "Endothelial dysfunction and cerebral hypoperfusion similar to Long COVID.",
    findings: [
      "Reduced brain perfusion",
      "Endothelial dysfunction markers",
      "Exercise-related perfusion decline",
    ],
    papers: [
      "32140630", // CBF reduction (ME/CFS)
      "38138257", // Severity-linked CBF
      "36905263", // Long COVID endothelial dysfunction
      "32556240", // Endothelial activation hypothesis
      "32717743", // Microvascular hypothesis review
    ],
  },

  {
    id: "hpa-axis",
    icon: "🧠⚖️",
    title: "HPA Axis / Hormonal Dysregulation",
    evidence: "EMERGING",
    findingSummary:
      "Flattened cortisol rhythms and stress axis dysregulation in subsets.",
    findings: [
      "Blunted cortisol awakening response",
      "Stress sensitivity signatures",
      "HPA–immune cross-talk",
    ],
    papers: [
      "32052865", // Cleare HPA review
      "16410296", // Cortisol abnormalities meta-analysis
      "19581845", // CAR abnormalities
      "10560123", // Early evidence — low cortisol
      "34239128", // Post-COVID HPA dysregulation
    ],
  },

  {
    id: "microbiome",
    icon: "🦠🌿",
    title: "Gut–Brain–Immune Axis & Microbiome",
    evidence: "MODERATE",
    findingSummary:
      "Dysbiosis, leaky gut, immune activation from microbial products.",
    findings: [
      "Low butyrate producers",
      "Microbial translocation markers (LPS, zonulin)",
      "Persistent dysbiosis in Long COVID mirrors ME/CFS",
    ],
    papers: [
      "27496797", // Giloteaux dysbiosis + LPS translocation
      "36893838", // Prolonged dysbiosis Long COVID similar to ME/CFS
      "31006369", // Hanson microbiome study
      "29776948", // Immune activation via gut permeability
      "36518224", // Microbiome correlates with severity (post-viral)
    ],
  },

  {
    id: "oxidative-stress",
    icon: "🧪⚡",
    title: "Oxidative & Nitrosative Stress",
    evidence: "EMERGING",
    findingSummary:
      "Oxidative damage, nitrosative stress, mitochondrial redox imbalance.",
    findings: [
      "Elevated reactive oxygen species",
      "Nitrosative stress markers",
      "Links to PEM and metabolic suppression",
    ],
    papers: [
      "17123643", // Maes O&NS hypothesis
      "16280193", // oxidative stress markers
      "20433584", // Increased peroxynitrite / NO metabolites
      "27747291", // Naviaux metabolomics supports oxidative stress
      "31532730", // Redox imbalance in post-viral fatigue
    ],
  },
];
