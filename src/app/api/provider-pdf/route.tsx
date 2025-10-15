// app/api/provider-pdf/route.tsx
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

// ⬇️ Adjust this import path if your file is elsewhere
import { provider } from "@/lib/providerContent";
import type { Diagnosis } from "@/lib/providerContent";

/* --------------------------- Type-safe content --------------------------- */

const fallbackDiagnosis: Diagnosis = {
  title: "Diagnosis (IOM/NAM 2015)",
  intro:
    "This section summarizes the IOM/NAM 2015 diagnostic framework for ME/CFS.",
  criteria: [],
  notes: [],
};

// Use the typed fallback so TS knows these keys exist
const d: Diagnosis = (provider?.diagnosis as Diagnosis) ?? fallbackDiagnosis;

/* ------------------------------- PDF styles ------------------------------ */

Font.registerHyphenationCallback((word) => [word]);

const s = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  h1: { fontSize: 16, fontWeight: 700, marginBottom: 6, textAlign: "center" },
  p: { lineHeight: 1.35, marginBottom: 6 },
  section: { marginTop: 10 },
  h2: { fontSize: 12, fontWeight: 700, marginBottom: 4 },
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

function Bullets({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <View style={s.ul}>
      {items.map((t, i) => (
        <Text key={i} style={s.li}>
          • {t}
        </Text>
      ))}
    </View>
  );
}

/* --------------------------------- Doc ---------------------------------- */

function DiagnosisPDF() {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <Text style={s.h1}>{d.title ?? "Diagnosis (IOM/NAM 2015)"}</Text>

        {d.intro ? <Text style={s.p}>{d.intro}</Text> : null}

        <View style={s.section}>
          <Text style={s.h2}>Diagnostic Criteria</Text>
          <Bullets items={d.criteria ?? []} />
        </View>

        {d.notes && d.notes.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Notes</Text>
            <Bullets items={d.notes} />
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

/* -------------------------------- Handler -------------------------------- */

export async function GET() {
  // Use Blob to avoid Buffer/ReadableStream typing churn
  const blob = await pdf(<DiagnosisPDF />).toBlob();

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="OpenMECFS-Diagnosis.pdf"',
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
