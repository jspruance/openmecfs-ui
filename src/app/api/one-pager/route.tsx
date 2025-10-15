// app/api/one-pager/route.tsx
export const runtime = "nodejs";
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

// Inline content...
const onePager = {
  /* ...exact same content as yours... */
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
  // Generate a Node Buffer/Uint8Array
  const buf = await pdf(<OnePagerPDF />).toBuffer();

  // Ensure BodyInit-friendly type (Uint8Array is an ArrayBufferView and valid BodyInit)
  const body = buf instanceof Uint8Array ? buf : new Uint8Array(buf as any);

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ME-CFS-One-Pager.pdf"',
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
