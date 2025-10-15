// app/api/one-pager/route.tsx
export const runtime = "nodejs"; // @react-pdf needs Node runtime
export const dynamic = "force-dynamic";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";

// Inline content (you can refactor to a shared module later)
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

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  h1: { fontSize: 16, fontWeight: 700, textAlign: "center", marginBottom: 6 },
  sub: { fontSize: 9, color: "#475569", textAlign: "center", marginBottom: 12 },
  section: { marginTop: 10 },
  h2: { fontSize: 12, fontWeight: 700, marginBottom: 4 },
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
});

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.ul}>
      {items.map((t, i) => (
        <Text key={i} style={styles.li}>
          • {t}
        </Text>
      ))}
    </View>
  );
}

function OnePagerPDF() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>{onePager.title}</Text>
        <Text style={styles.sub}>{onePager.sub}</Text>

        <View style={styles.section}>
          <Text style={styles.h2}>What is ME/CFS?</Text>
          <Text style={styles.p}>{onePager.whatIs}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>IOM/NAM 2015 Diagnostic Criteria</Text>
        </View>
        <BulletList items={onePager.criteria} />

        <View style={styles.section}>
          <Text style={styles.h2}>Common Symptoms</Text>
        </View>
        <BulletList items={onePager.symptoms} />

        <View style={styles.section}>
          <Text style={styles.h2}>Diagnosis (Clinical)</Text>
          <Text style={styles.p}>
            No single lab test. Diagnose clinically using IOM criteria and by
            excluding alternative explanations. Key steps:
          </Text>
        </View>
        <BulletList items={onePager.diagnosisSteps} />

        <View style={styles.section}>
          <Text style={styles.h2}>Testing (Rule-Outs & Baseline)</Text>
          <Text style={styles.p}>
            Targeted testing helps exclude common mimics/contributors and
            establish baselines (adapt to context):
          </Text>
        </View>
        <BulletList items={onePager.tests} />

        <View style={styles.section}>
          <Text style={styles.h2}>Management (Symptom-Directed)</Text>
        </View>
        <BulletList items={onePager.management} />

        <View style={styles.section}>
          <View style={styles.hr} />
          <Text style={styles.foot}>{onePager.footer}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function GET() {
  const buffer = await pdf(<OnePagerPDF />).toBuffer();
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ME-CFS-One-Pager.pdf"',
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
