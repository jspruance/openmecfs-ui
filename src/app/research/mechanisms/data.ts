// src/app/research/mechanisms/data.ts

export interface Mechanism {
  id: string;
  title: string;
  summary: string;
  evidence_level: "emerging" | "moderate" | "strong";
  key_findings: string[];
  related_subtypes: number[];
  related_papers: string[]; // PMIDs
}

export const mechanisms: Mechanism[] = [
  {
    id: "neuroinflammation",
    title: "Neuroinflammation",
    summary:
      "Chronic activation of microglia and central inflammatory signaling may drive fatigue, cognitive impairment, and sensory hypersensitivity in ME/CFS.",
    evidence_level: "moderate",
    key_findings: [
      "Microglial activation observed in PET imaging",
      "Elevated neuroinflammatory cytokines in CSF",
      "Neuroimmune overlap with Long COVID",
    ],
    related_subtypes: [0, 1],
    related_papers: ["32497511", "35123455"],
  },
  {
    id: "autonomic-dysfunction",
    title: "Autonomic Dysregulation / OI",
    summary:
      "Autonomic imbalance, impaired cerebral blood flow, and orthostatic intolerance are common in ME/CFS, suggesting disruption of autonomic nervous system control.",
    evidence_level: "strong",
    key_findings: [
      "Reduced cerebral blood flow during tilt-table tests",
      "High prevalence of POTS and orthostatic intolerance",
      "Autonomic symptom improvement linked with pacing",
    ],
    related_subtypes: [1],
    related_papers: ["28396082", "37512499"],
  },
  {
    id: "mitochondrial-dysfunction",
    title: "Mitochondrial Energy Impairment",
    summary:
      "Evidence shows impaired ATP production, redox imbalance, and altered metabolic pathways that limit cellular energy availability.",
    evidence_level: "emerging",
    key_findings: [
      "Reduced ATP synthesis in muscle biopsy studies",
      "Altered redox metabolism and lactate abnormalities",
      "Overlap with metabolic post-viral syndromes",
    ],
    related_subtypes: [0],
    related_papers: ["31245678"],
  },
];
