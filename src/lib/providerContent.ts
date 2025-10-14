// src/app/lib/providerContent.ts

/* =========================
   Types used across modules
   ========================= */

export type QuickStart = {
  title: string;
  intro: string;
  principles: string[];
  whatNotToDo: string[];
  visitFlow: string[];
  pemExplainer?: string;
  oiSteps: string[];
  baselineWorkup: string[];
  initialManagement: string[];
  followUp: string[];
  redFlags: string[];
  documentation: {
    assessment: string;
    plan: string;
    accommodations: string;
  };
};

export type Diagnosis = {
  title?: string;
  intro?: string;
  criteria: string[];
  notes?: string[];
};

export type Differential = {
  title?: string;
  intro?: string;
  tests: string[]; // baseline / targeted tests
  mimics: string[]; // common look-alikes
};

export type Orthostatic = {
  title?: string;
  intro?: string;
  screen: string[]; // history + office screens
  tenMinuteStand?: string[]; // optional details
  therapy: string[]; // fluids/salt/compression/meds
};

export type Management = {
  title?: string;
  intro?: string;
  pacing: string[];
  sleep: string[];
  pain: string[];
  meds: string[];
  supplements?: string[];
};

export type ProviderContent = {
  quickStart: {
    title?: string;
    intro?: string;
    principles?: string[];
    whatNotToDo?: string[];
    visitFlow?: string[];
    pemExplainer?: string;
    oiSteps?: string[];
    baselineWorkup?: string[];
    initialManagement?: string[];
    followUp?: string[];
    redFlags?: string[];
    documentation?: {
      assessment?: string;
      plan?: string;
      accommodations?: string;
    };
  };
  workup: { title?: string; intro?: string; lists?: string[][] };
  iom: { title?: string; bullets?: string[] };
  footer?: string;
};

/* =========================
   Your content (typed)
   ========================= */

export const provider: ProviderContent = {
  /* ----- Your full Quick-Start (unchanged text) ----- */
  quickStart: {
    title: "ME/CFS Quick-Start for Clinicians (10–15 min)",
    intro:
      "ME/CFS is a chronic, multisystem disease marked by Post-Exertional Malaise (PEM), unrefreshing sleep, cognitive dysfunction, and often orthostatic intolerance (OI). The goal of a first visit is to validate, identify PEM/OI, rule out common mimics, begin symptom-directed care, and set a safe follow-up plan.",
    principles: [
      "Validate and name PEM; avoid recommending graded exertion that provokes crashes.",
      "Assume energy limits: use pacing/‘energy-envelope’ framing from day one.",
      "Screen for OI with lying→standing vitals and symptom history.",
      "Start with low-risk symptom relief while ruling out mimics; escalate thoughtfully.",
    ],
    whatNotToDo: [
      "Avoid dismissing symptoms as purely psychological when PEM/OI features are present.",
      "Do not push patients to ‘build stamina’ through fixed-increment exercise when PEM is present.",
      "Do not use Graded Exercise Therapy (GET) or fixed-progression activity plans; these can trigger or worsen PEM.",
      "Do not present Cognitive Behavioral Therapy (CBT) as disease-modifying; at most, offer it as optional coping support.",
      "Avoid large medication changes during an acute crash; go ‘start low, go slow’.",
    ],
    visitFlow: [
      "History highlights: exertion triggers/delays (24–48 h), sleep quality, brain fog, upright symptoms.",
      "PEM screen: “Do your symptoms worsen after small efforts, often with a 24–48 h delay?”",
      "OI screen: lightheadedness/palpitations/‘pressure’ upright; intolerance of heat/showers/standing.",
      "Lying→standing vitals at 0, 2, 5, 10 min; document HR/BP + symptoms.",
      "Baseline tests & differentials (see Workup).",
      "Initial plan: pacing education; fluids/salt/compression if OI suspected; sleep and pain support.",
      "Follow-up timeframe: 4–6 weeks with a written crash-prevention plan.",
    ],
    pemExplainer:
      "Post-Exertional Malaise (PEM) is a hallmark: a delayed (often 24–48 h) worsening of symptoms after minor physical, cognitive, or orthostatic stress. Management prioritizes preventing PEM via pacing, activity modification, and symptom-guided titration.",
    oiSteps: [
      "Supine rest 10 min → record HR/BP.",
      "Stand unsupported; record HR/BP at 2, 5, 10 min and track symptoms.",
      "First-line: ~2–3 L fluids/day as tolerated, liberalize salt if safe, waist-high compression.",
      "Consider meds when conservative measures insufficient and clinically appropriate (e.g., fludrocortisone, midodrine, beta-blocker, pyridostigmine).",
    ],
    baselineWorkup: [
      "CBC, CMP, TSH/Free T4.",
      "Ferritin/iron studies, B12, folate, vitamin D.",
      "CRP/ESR; ANA if autoimmune features.",
      "HbA1c, lipids as indicated.",
      "Morning cortisol if adrenal concern.",
      "Sleep evaluation if symptoms suggest OSA/PLMD.",
      "Orthostatic testing (lying/standing; consider tilt when appropriate).",
      "Additional tests driven by history/exam.",
    ],
    initialManagement: [
      "Pacing/energy envelope education; activity should not provoke PEM.",
      "Sleep: hygiene; consider melatonin or low-dose agents for restorative sleep.",
      "Pain/headache: multimodal; treat migraine where present.",
      "OI: fluids/salt/compression ± medications per judgment and comorbidities.",
      "Correct deficiencies (vitamin D, B12, iron/ferritin).",
      "Consider low-dose naltrexone (LDN) via shared decision-making for pain/fatigue modulation.",
    ],
    followUp: [
      "Schedule in 4–6 weeks; review PEM frequency/severity and OI symptoms.",
      "Titrate measures based on response; avoid changes that trigger crashes.",
      "Provide written pacing guidance and crash plan; involve caregivers when helpful.",
    ],
    redFlags: [
      "Red, hot, or swollen joints; true focal neurologic deficits; chest pain/syncope without warning.",
      "Rapid unintentional weight loss, fevers, drenching night sweats.",
      "Severe depression, suicidality, unsafe home environment.",
    ],
    documentation: {
      assessment:
        "Chronic multisystem illness consistent with ME/CFS. Hallmark Post-Exertional Malaise (PEM) present. Symptoms include unrefreshing sleep, cognitive dysfunction, and orthostatic intolerance. Exam notable for [findings]. Lying→standing vitals show [results].",
      plan: "Education re: PEM and pacing; avoid exertion that provokes crashes. OI measures: fluids/salt/compression; consider [med] if conservative measures insufficient. Sleep optimization: [intervention]. Address pain/headache per multimodal plan. Labs ordered for differentials. Follow-up 4–6 weeks.",
      accommodations:
        "Recommend flexible scheduling, remote options, reduced continuous upright time, quiet spaces, and rest breaks to prevent PEM; provide note as needed.",
    },
  },

  /* ----- Diagnosis (from your IOM section) ----- */
  diagnosis: {
    title: "Diagnosis (IOM/NAM 2015)",
    intro:
      "Clinical diagnosis using characteristic features and exclusion of other conditions; no single lab confirms ME/CFS.",
    criteria: [
      "Substantial activity reduction/impairment >6 months due to fatigue not alleviated by rest.",
      "Post-Exertional Malaise (PEM).",
      "Unrefreshing sleep.",
      "At least one: cognitive impairment or orthostatic intolerance (OI).",
    ],
    notes: [
      "Use targeted testing to exclude common mimics and establish baselines.",
    ],
  },

  /* ----- Differential / Workup (flattened from your workup.lists) ----- */
  differential: {
    title: "Differential & Workup (Rule-Outs + Baseline)",
    intro:
      "Targeted tests help exclude common mimics/contributors and establish baselines. Adapt to context and findings.",
    tests: [
      "CBC, CMP, TSH/Free T4",
      "Ferritin/iron studies, B12, Folate, Vitamin D",
      "CRP/ESR; ANA if autoimmune features",
      "HbA1c; Lipids as indicated",
      "Morning cortisol if adrenal concern",
      "Sleep evaluation if symptoms suggest OSA/PLMD",
      "Orthostatic testing (lying/standing; consider tilt when appropriate)",
      "Additional tests driven by history/exam",
    ],
    mimics: [
      "Anemia/iron deficiency",
      "Thyroid disease",
      "Primary sleep disorders (OSA/PLMD)",
      "Major depressive disorder (without PEM), anxiety with hyperventilation",
      "Autonomic disorders including POTS variants",
      "Autoimmune disease",
      "Medication side-effects",
      "Endocrine/metabolic conditions",
      "Infection sequelae and other post-viral syndromes",
    ],
  },

  /* ----- Orthostatic (extracted from your quickStart OI content) ----- */
  orthostatic: {
    title: "Orthostatic Intolerance",
    intro:
      "OI is common in ME/CFS; screen with history and simple office maneuvers and treat with conservative measures first.",
    screen: [
      "Ask about lightheadedness, palpitations, presyncope, ‘pressure’, and heat/shower/standing intolerance.",
      "Perform lying→standing vitals at 0, 2, 5, 10 minutes; document symptoms.",
    ],
    tenMinuteStand: [
      "Supine rest 10 min → record HR/BP; stand unsupported; record HR/BP at 2/5/10 min with symptoms.",
    ],
    therapy: [
      "First-line: ~2–3 L fluids/day as tolerated; liberalize salt if safe; waist-high compression.",
      "Consider medications when conservative measures are insufficient (e.g., fludrocortisone, midodrine, beta-blocker).",
    ],
  },

  /* ----- Management (organized from your initialManagement content) ----- */
  management: {
    title: "Management Basics",
    intro:
      "Focus on preventing PEM and relieving symptoms with shared decision-making; start low, go slow.",
    pacing: [
      "Pacing/energy-envelope education; activity should not provoke PEM.",
      "Provide written pacing guidance and crash plan.",
    ],
    sleep: [
      "Sleep hygiene; consider melatonin or low-dose agents for restorative sleep.",
    ],
    pain: ["Multimodal pain/headache approach; treat migraine where present."],
    meds: [
      "OI: fluids/salt/compression ± medications per judgment and comorbidities.",
      "Consider low-dose naltrexone (LDN) for pain/fatigue modulation.",
    ],
    supplements: ["Correct deficiencies (vitamin D, B12, iron/ferritin)."],
  },

  footer:
    "For health professionals. Informational only — not medical advice. Based on IOM/NAM 2015 criteria and common clinical practices.",

  // Order used when building the multi-page “Provider Pack” PDF
  packOrder: [
    "quickStart",
    "diagnosis",
    "differential",
    "orthostatic",
    "management",
  ],
};
