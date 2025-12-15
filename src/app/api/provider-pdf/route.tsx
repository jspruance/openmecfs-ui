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
import type {
  Diagnosis,
  QuickStart,
  Differential,
  Orthostatic,
  Management,
} from "@/lib/providerContent";

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

/* --------------------------- PDF Components --------------------------- */

function QuickStartPDF() {
  const qs = provider?.quickStart;
  const q: QuickStart = {
    title: qs?.title ?? "ME/CFS Quick-Start for Clinicians",
    intro: qs?.intro ?? "",
    principles: qs?.principles ?? [],
    whatNotToDo: qs?.whatNotToDo ?? [],
    visitFlow: qs?.visitFlow ?? [],
    pemExplainer: qs?.pemExplainer,
    oiSteps: qs?.oiSteps ?? [],
    baselineWorkup: qs?.baselineWorkup ?? [],
    initialManagement: qs?.initialManagement ?? [],
    followUp: qs?.followUp ?? [],
    redFlags: qs?.redFlags ?? [],
    documentation: {
      assessment: qs?.documentation?.assessment ?? "",
      plan: qs?.documentation?.plan ?? "",
      accommodations: qs?.documentation?.accommodations ?? "",
    },
  };

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <Text style={s.h1}>{q.title ?? "Quick-Start (10–15 min)"}</Text>
        {q.intro ? <Text style={s.p}>{q.intro}</Text> : null}

        {q.principles && q.principles.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Key Principles</Text>
            <Bullets items={q.principles} />
          </View>
        ) : null}

        {q.whatNotToDo && q.whatNotToDo.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>What Not to Do</Text>
            <Bullets items={q.whatNotToDo} />
          </View>
        ) : null}

        {q.visitFlow && q.visitFlow.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>First Visit Flow</Text>
            <Bullets items={q.visitFlow} />
          </View>
        ) : null}

        {q.pemExplainer ? (
          <View style={s.section}>
            <Text style={s.h2}>Post-Exertional Malaise (PEM)</Text>
            <Text style={s.p}>{q.pemExplainer}</Text>
          </View>
        ) : null}

        {q.oiSteps && q.oiSteps.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Orthostatic Intolerance Screen</Text>
            <Bullets items={q.oiSteps} />
          </View>
        ) : null}

        {q.baselineWorkup && q.baselineWorkup.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Baseline Workup</Text>
            <Bullets items={q.baselineWorkup} />
          </View>
        ) : null}

        {q.initialManagement && q.initialManagement.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Initial Management</Text>
            <Bullets items={q.initialManagement} />
          </View>
        ) : null}

        {q.followUp && q.followUp.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Follow-Up</Text>
            <Bullets items={q.followUp} />
          </View>
        ) : null}

        {q.redFlags && q.redFlags.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Red Flags</Text>
            <Bullets items={q.redFlags} />
          </View>
        ) : null}

        {q.documentation ? (
          <View style={s.section}>
            <Text style={s.h2}>Documentation Templates</Text>
            {q.documentation.assessment ? (
              <View style={s.section}>
                <Text style={s.h2}>Assessment</Text>
                <Text style={s.p}>{q.documentation.assessment}</Text>
              </View>
            ) : null}
            {q.documentation.plan ? (
              <View style={s.section}>
                <Text style={s.h2}>Plan</Text>
                <Text style={s.p}>{q.documentation.plan}</Text>
              </View>
            ) : null}
            {q.documentation.accommodations ? (
              <View style={s.section}>
                <Text style={s.h2}>Accommodations</Text>
                <Text style={s.p}>{q.documentation.accommodations}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

function DiagnosisPDF() {
  const fallbackDiagnosis: Diagnosis = {
    title: "Diagnosis (IOM/NAM 2015)",
    intro:
      "This section summarizes the IOM/NAM 2015 diagnostic framework for ME/CFS.",
    criteria: [],
    notes: [],
  };

  const d: Diagnosis = (provider?.diagnosis as Diagnosis) ?? fallbackDiagnosis;

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

function DifferentialPDF() {
  const fallbackDifferential: Differential = {
    title: "Differential & Workup",
    intro: "",
    tests: [],
    mimics: [],
  };

  const diff: Differential =
    (provider?.differential as Differential) ?? fallbackDifferential;

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <Text style={s.h1}>
          {diff.title ?? "Differential & Workup (Rule-Outs + Baseline)"}
        </Text>

        {diff.intro ? <Text style={s.p}>{diff.intro}</Text> : null}

        {diff.tests && diff.tests.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Baseline/Targeted Tests</Text>
            <Bullets items={diff.tests} />
          </View>
        ) : null}

        {diff.mimics && diff.mimics.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Common Mimics to Rule Out</Text>
            <Bullets items={diff.mimics} />
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

function OrthostaticPDF() {
  const fallbackOrthostatic: Orthostatic = {
    title: "Orthostatic Intolerance",
    intro: "",
    screen: [],
    therapy: [],
  };

  const o: Orthostatic =
    (provider?.orthostatic as Orthostatic) ?? fallbackOrthostatic;

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <Text style={s.h1}>{o.title ?? "Orthostatic Intolerance"}</Text>

        {o.intro ? <Text style={s.p}>{o.intro}</Text> : null}

        {o.screen && o.screen.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>History & Office Screens</Text>
            <Bullets items={o.screen} />
          </View>
        ) : null}

        {o.tenMinuteStand && o.tenMinuteStand.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>10-Minute Stand (NASA Lean Test)</Text>
            <Bullets items={o.tenMinuteStand} />
          </View>
        ) : null}

        {o.therapy && o.therapy.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Therapy Options</Text>
            <Bullets items={o.therapy} />
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

function ManagementPDF() {
  const fallbackManagement: Management = {
    title: "Management Basics",
    intro: "",
    pacing: [],
    sleep: [],
    pain: [],
    meds: [],
    supplements: [],
  };

  const m: Management =
    (provider?.management as Management) ?? fallbackManagement;

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <Text style={s.h1}>{m.title ?? "Management Basics"}</Text>

        {m.intro ? <Text style={s.p}>{m.intro}</Text> : null}

        {m.pacing && m.pacing.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>PEM Prevention & Pacing</Text>
            <Bullets items={m.pacing} />
          </View>
        ) : null}

        {m.sleep && m.sleep.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Sleep</Text>
            <Bullets items={m.sleep} />
          </View>
        ) : null}

        {m.pain && m.pain.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Pain & Headache</Text>
            <Bullets items={m.pain} />
          </View>
        ) : null}

        {m.meds && m.meds.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Medications</Text>
            <Bullets items={m.meds} />
          </View>
        ) : null}

        {m.supplements && m.supplements.length > 0 ? (
          <View style={s.section}>
            <Text style={s.h2}>Supplements & Deficiencies</Text>
            <Bullets items={m.supplements} />
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

/* -------------------------------- Handler -------------------------------- */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doc = searchParams.get("doc");

  // Normalize doc parameter (handle both quickStart and quick-start)
  const normalizedDoc = doc === "quick-start" ? "quickStart" : doc || "diagnosis";

  let pdfComponent;
  let filename;

  switch (normalizedDoc) {
    case "quickStart":
      pdfComponent = <QuickStartPDF />;
      filename = "OpenMECFS-QuickStart.pdf";
      break;
    case "diagnosis":
      pdfComponent = <DiagnosisPDF />;
      filename = "OpenMECFS-Diagnosis.pdf";
      break;
    case "differential":
      pdfComponent = <DifferentialPDF />;
      filename = "OpenMECFS-Differential.pdf";
      break;
    case "orthostatic":
      pdfComponent = <OrthostaticPDF />;
      filename = "OpenMECFS-Orthostatic.pdf";
      break;
    case "management":
      pdfComponent = <ManagementPDF />;
      filename = "OpenMECFS-Management.pdf";
      break;
    default:
      // Default to diagnosis if unknown doc type
      pdfComponent = <DiagnosisPDF />;
      filename = "OpenMECFS-Diagnosis.pdf";
      break;
  }

  const blob = await pdf(pdfComponent).toBlob();

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
