export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import React from "react";
import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";
import { provider } from "@/lib/providerContent";

Font.registerHyphenationCallback((word) => [word as string]);

const s = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  h1: { fontSize: 14, fontWeight: 700, marginBottom: 8 },
  h2: { fontSize: 11, fontWeight: 700, marginTop: 10, marginBottom: 4 },
  p: { lineHeight: 1.35, marginBottom: 6 },
  ul: { marginLeft: 10, marginTop: 2 },
  li: { marginBottom: 2 },
  foot: { fontSize: 8, color: "#475569", marginTop: 10 },
});

const Bullets = ({ items }: { items?: string[] }) =>
  !items?.length ? null : (
    <View style={s.ul}>
      {items.map((t, i) => (
        <Text key={i} style={s.li}>
          • {t}
        </Text>
      ))}
    </View>
  );

const Section = ({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) => (
  <View>
    <Text style={s.h2}>{title}</Text>
    {children}
  </View>
);

/* ---------- Pages ---------- */
const PageQuickStart = () => {
  const q = provider.quickStart ?? {};
  return (
    <Page size="LETTER" style={s.page}>
      <Text style={s.h1}>{q.title ?? "ME/CFS Quick-Start"}</Text>
      {q.intro ? <Text style={s.p}>{q.intro}</Text> : null}
      <Section title="Care Principles">
        <Bullets items={q.principles} />
      </Section>
      <Section title="Avoid (What Not to Do)">
        <Bullets items={q.whatNotToDo} />
      </Section>
      <Section title="First-Visit Flow (10–15 min)">
        <Bullets items={q.visitFlow} />
      </Section>
      {q.pemExplainer ? (
        <Section title="PEM Explainer">
          <Text style={s.p}>{q.pemExplainer}</Text>
        </Section>
      ) : null}
      <Section title="Orthostatic Intolerance — Bedside Steps">
        <Bullets items={q.oiSteps} />
      </Section>
      <Section title="Baseline Workup">
        <Bullets items={q.baselineWorkup} />
      </Section>
      <Section title="Initial Management">
        <Bullets items={q.initialManagement} />
      </Section>
      <Section title="Follow-Up">
        <Bullets items={q.followUp} />
      </Section>
      <Section title="Red Flags">
        <Bullets items={q.redFlags} />
      </Section>
      {q.documentation ? (
        <Section title="Smart Phrases (Copy-Paste)">
          {q.documentation.assessment ? (
            <Text style={s.p}>
              <Text style={{ fontWeight: 700 }}>Assessment: </Text>
              {q.documentation.assessment}
            </Text>
          ) : null}
          {q.documentation.plan ? (
            <Text style={s.p}>
              <Text style={{ fontWeight: 700 }}>Plan: </Text>
              {q.documentation.plan}
            </Text>
          ) : null}
          {q.documentation.accommodations ? (
            <Text style={s.p}>
              <Text style={{ fontWeight: 700 }}>Accommodations: </Text>
              {q.documentation.accommodations}
            </Text>
          ) : null}
        </Section>
      ) : null}
      <Text style={s.foot}>{provider.footer ?? ""}</Text>
    </Page>
  );
};

const PageDiagnosis = () => {
  const d = provider.diagnosis ?? {};
  return (
    <Page size="LETTER" style={s.page}>
      <Text style={s.h1}>{d.title ?? "Diagnosis (IOM/NAM 2015)"}</Text>
      {d.intro ? <Text style={s.p}>{d.intro}</Text> : null}
      <Bullets items={d.criteria} />
      {d.notes?.length ? (
        <>
          <Text style={s.h2}>Notes</Text>
          <Bullets items={d.notes} />
        </>
      ) : null}
      <Text style={s.foot}>{provider.footer ?? ""}</Text>
    </Page>
  );
};

const PageDifferential = () => {
  const df = provider.differential ?? {};
  return (
    <Page size="LETTER" style={s.page}>
      <Text style={s.h1}>{df.title ?? "Differential & Workup"}</Text>
      {df.intro ? <Text style={s.p}>{df.intro}</Text> : null}
      <Text style={s.h2}>Baseline / Targeted Tests</Text>
      <Bullets items={df.tests} />
      <Text style={s.h2}>Common Mimics</Text>
      <Bullets items={df.mimics} />
      <Text style={s.foot}>{provider.footer ?? ""}</Text>
    </Page>
  );
};

const PageOrthostatic = () => {
  const o = provider.orthostatic ?? {};
  return (
    <Page size="LETTER" style={s.page}>
      <Text style={s.h1}>{o.title ?? "Orthostatic Intolerance"}</Text>
      {o.intro ? <Text style={s.p}>{o.intro}</Text> : null}
      <Text style={s.h2}>Screen</Text>
      <Bullets items={o.screen} />
      {o.tenMinuteStand?.length ? (
        <>
          <Text style={s.h2}>10-Minute Stand</Text>
          <Bullets items={o.tenMinuteStand} />
        </>
      ) : null}
      <Text style={s.h2}>Therapy</Text>
      <Bullets items={o.therapy} />
      <Text style={s.foot}>{provider.footer ?? ""}</Text>
    </Page>
  );
};

const PageManagement = () => {
  const m = provider.management ?? {};
  return (
    <Page size="LETTER" style={s.page}>
      <Text style={s.h1}>{m.title ?? "Management Basics"}</Text>
      {m.intro ? <Text style={s.p}>{m.intro}</Text> : null}
      <Text style={s.h2}>Pacing</Text>
      <Bullets items={m.pacing} />
      <Text style={s.h2}>Sleep</Text>
      <Bullets items={m.sleep} />
      <Text style={s.h2}>Pain</Text>
      <Bullets items={m.pain} />
      <Text style={s.h2}>Medications</Text>
      <Bullets items={m.meds} />
      {m.supplements?.length ? (
        <>
          <Text style={s.h2}>Supplements</Text>
          <Bullets items={m.supplements} />
        </>
      ) : null}
      <Text style={s.foot}>{provider.footer ?? ""}</Text>
    </Page>
  );
};

/* ---------- Router ---------- */
function pagesFor(key: string) {
  switch (key) {
    case "quickStart":
      return [<PageQuickStart key="q" />];
    case "diagnosis":
      return [<PageDiagnosis key="d" />];
    case "differential":
      return [<PageDifferential key="df" />];
    case "orthostatic":
      return [<PageOrthostatic key="o" />];
    case "management":
      return [<PageManagement key="m" />];
    default:
      return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const doc = req.nextUrl.searchParams.get("doc") ?? "quick-start";

    let document: JSX.Element;

    if (doc === "pack") {
      const order = provider.packOrder ?? [
        "quickStart",
        "diagnosis",
        "differential",
        "orthostatic",
        "management",
      ];
      const pages = order.flatMap(pagesFor);
      if (!pages.length)
        return NextResponse.json(
          { ok: false, error: "No pages" },
          { status: 400 }
        );
      document = <Document>{pages}</Document>;
    } else {
      const singleKey = doc === "quick-start" ? "quickStart" : doc; // map query to key
      const pages = pagesFor(singleKey);
      if (!pages.length)
        return NextResponse.json(
          { ok: false, error: "Unknown doc" },
          { status: 400 }
        );
      document = <Document>{pages}</Document>;
    }

    const blob = await pdf(document).toBlob();
    const filename =
      doc === "pack"
        ? "ME-CFS-Provider-Pack.pdf"
        : `ME-CFS-Provider-${doc}.pdf`;

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("provider-pdf error:", err);
    return NextResponse.json(
      { ok: false, error: "PDF generation failed" },
      { status: 500 }
    );
  }
}
