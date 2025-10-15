// app/api/one-pager/route.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { Document, Page, Text, View, pdf, Font } from "@react-pdf/renderer";
import { Readable } from "node:stream";

/* --------- Content (unchanged; tweak as you like) --------- */
const onePager = {
  title: "Myalgic Encephalomyelitis / Chronic Fatigue Syndrome (ME/CFS)",
  sub: "Concise overview for clinicians, patients, and families.",
  whatIs:
    "ME/CFS is a serious, chronic, multisystem disease that disrupts energy production, autonomic regulation, and immune function. Core features include post-exertional malaise (PEM) (symptom worsening after even minor effort), unrefreshing sleep, cognitive dysfunction (“brain fog”), and often orthostatic intolerance (OI). It is recognized by the U.S. National Academy of Medicine (IOM/NAM) as a biological illness.",
  criteria: [
    "Substantial reduction/impairment in activity for > 6 months due to fatigue not alleviated by rest.",
    "Post-exertional malaise (PEM).",
    "Unrefreshing sleep.",
    "At least one: cognitive impairment or orthostatic intolerance (OI).",
  ],
  symptoms: [
    "Worsening after exertion (PEM), often delayed 24–48 h",
    "Brain fog, slowed processing, memory issues",
    "Lightheadedness, palpitations when upright (OI)",
    "Unrefreshing or fragmented sleep",
    "Widespread pain, sensory overload",
    "Headaches, sore throat, tender lymph nodes, GI issues",
  ],
  diagnosisSteps: [
    "History focused on PEM, sleep, cognition, and upright tolerance.",
    "Physical exam with orthostatic vitals (lying/standing or 10-min stand).",
    "Review medications, comorbidities (POTS, MCAS, hEDS, migraine, etc.).",
  ],
  tests: [
    "CBC, CMP, TSH/Free T4",
    "Ferritin/iron studies, B12, folate, vitamin D",
    "CRP/ESR; ANA if autoimmune features",
    "Morning cortisol if adrenal concern",
    "HbA1c, lipids as indicated",
    "Sleep evaluation if symptoms suggest OSA/PLMD",
    "Orthostatic testing; consider tilt when appropriate",
    "Additional tests driven by history/exam",
  ],
  management: [
    "Pacing & energy management: stay within the “energy envelope” to reduce PEM; avoid crashes.",
    "Sleep: hygiene, melatonin or low-dose agents for restorative sleep.",
    "OI: fluids/salt, compression, and medications (e.g., fludrocortisone, midodrine, beta-blockers) as appropriate.",
    "Pain & symptom control: multimodal approach (neuropathic agents, headache care, migraine prevention).",
    "Adjuncts: treat deficiencies (D, B12, ferritin); consider low dose naltrexone (LDN) in shared decision-making.",
  ],
  footer:
    "This sheet summarizes widely used guidance (IOM/NAM 2015 criteria) and common clinical approaches. Informational only—does not replace medical advice. More at Open ME/CFS.",
};

// keep long tokens intact
Font.registerHyphenationCallback((word) => [word]);

/* --------- Minimal styles without StyleSheet to avoid lint noise --------- */
const S = {
  page: {
    padding: 32,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  } as const,
  h1: {
    fontSize: 16,
    fontWeight: 700 as const,
    textAlign: "center" as const,
    marginBottom: 6,
  },
  sub: {
    fontSize: 9,
    color: "#475569",
    textAlign: "center" as const,
    marginBottom: 12,
  },
  section: { marginTop: 10 },
  h2: { fontSize: 12, fontWeight: 700 as const, marginBottom: 4 },
  p: { lineHeight: 1.35, marginBottom: 4 },
  ul: { marginLeft: 10, marginTop: 2 },
  li: { marginBottom: 2 },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginTop: 8,
    marginBottom: 6,
  },
  foot: { fontSize: 8, color: "#475569", lineHeight: 1.35 },
};

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={S.ul}>
      {items.map((t, i) => (
        <Text key={i} style={S.li}>
          • {t}
        </Text>
      ))}
    </View>
  );
}

function OnePagerPDF() {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <Text style={S.h1}>{onePager.title}</Text>
        <Text style={S.sub}>{onePager.sub}</Text>

        <View style={S.section}>
          <Text style={S.h2}>What is ME/CFS?</Text>
          <Text style={S.p}>{onePager.whatIs}</Text>
        </View>

        <View style={S.section}>
          <Text style={S.h2}>IOM/NAM 2015 Diagnostic Criteria</Text>
        </View>
        <BulletList items={onePager.criteria} />

        <View style={S.section}>
          <Text style={S.h2}>Common Symptoms</Text>
        </View>
        <BulletList items={onePager.symptoms} />

        <View style={S.section}>
          <Text style={S.h2}>Diagnosis (Clinical)</Text>
          <Text style={S.p}>
            No single lab test. Diagnose clinically using IOM criteria and by
            excluding alternative explanations. Key steps:
          </Text>
        </View>
        <BulletList items={onePager.diagnosisSteps} />

        <View style={S.section}>
          <Text style={S.h2}>Testing (Rule-Outs & Baseline)</Text>
          <Text style={S.p}>
            Targeted testing helps exclude common mimics/contributors and
            establish baselines (adapt to context):
          </Text>
        </View>
        <BulletList items={onePager.tests} />

        <View style={S.section}>
          <Text style={S.h2}>Management (Symptom-Directed)</Text>
        </View>
        <BulletList items={onePager.management} />

        <View style={S.section}>
          <View style={S.hr} />
          <Text style={S.foot}>{onePager.footer}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function GET() {
  // Generate Node stream and convert to Web stream to satisfy BodyInit
  const nodeStream = await pdf(<OnePagerPDF />).toStream();
  const webStream = Readable.toWeb(nodeStream); // ReadableStream<Uint8Array>

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ME-CFS-One-Pager.pdf"',
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
