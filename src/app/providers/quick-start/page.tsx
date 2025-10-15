// src/app/providers/quick-start/page.tsx
"use client";

import { provider } from "@/lib/providerContent";
import {
  Stethoscope,
  HeartPulse,
  Activity,
  ClipboardList,
  Download,
  AlertTriangle,
  Droplets,
  Moon,
  Sparkles,
  ClipboardCopy,
} from "lucide-react";
import type { QuickStart } from "@/lib/providerContent";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
      {children}
    </span>
  );
}

function Callout({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <div className="mt-1 text-[13.5px] leading-6">{children}</div>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  tint = "sky",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tint?: "sky" | "violet" | "emerald" | "amber" | "rose" | "slate";
  children: React.ReactNode;
}) {
  const map: Record<string, string> = {
    sky: "bg-sky-50/60 border-sky-100",
    violet: "bg-violet-50/60 border-violet-100",
    emerald: "bg-emerald-50/60 border-emerald-100",
    amber: "bg-amber-50/60 border-amber-100",
    rose: "bg-rose-50/60 border-rose-100",
    slate: "bg-slate-50/60 border-slate-100",
  };

  return (
    <section
      className={`rounded-2xl border p-5 ${map[tint]} shadow-[0_1px_0_rgba(15,23,42,0.02)]`}
    >
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-white/70 p-2 shadow-sm ring-1 ring-black/5">
          {icon}
        </span>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="mt-3 text-[14.5px] leading-7 text-slate-800">
        {children}
      </div>
    </section>
  );
}

/** Tolerant bullets: accepts optional array */
function Bullets({ items = [] }: { items?: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-5">
      {items.map((t, i) => (
        <li key={`${t}-${i}`}>{t}</li>
      ))}
    </ul>
  );
}

function CopyBlock({ label, text = "" }: { label: string; text?: string }) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <button
          onClick={onCopy}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:bg-white hover:shadow-sm"
          type="button"
        >
          <ClipboardCopy className="h-3.5 w-3.5" /> Copy
        </button>
      </div>
      <pre className="mt-2 whitespace-pre-wrap text-[13px] leading-5 text-slate-700">
        {text}
      </pre>
    </div>
  );
}

export default function QuickStart() {
  // Safe fallback so the page renders even if content is missing
  const q: QuickStart = (provider as any)?.quickStart ?? {
    title: "Provider Quick-Start",
    intro: "",
    principles: [],
    whatNotToDo: [],
    visitFlow: [],
    pemExplainer: "",
    oiSteps: [],
    baselineWorkup: [],
    initialManagement: [],
    followUp: [],
    redFlags: [],
    documentation: {
      assessment: "",
      plan: "",
      accommodations: "",
    },
  };

  const doc = q.documentation ?? {
    assessment: "",
    plan: "",
    accommodations: "",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Soft gradient header band */}
      <div className="rounded-t-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              <Chip>Provider Quick-Start</Chip>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {q.title}
            </h1>
            {q.intro ? (
              <p className="mt-2 max-w-3xl text-[15px] leading-7 text-slate-700">
                {q.intro}
              </p>
            ) : null}
          </div>

          <a
            href="/api/provider-pdf?doc=quick-start"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </div>

        <Callout
          icon={<Sparkles className="h-5 w-5 text-amber-700" />}
          title="Goal of the first visit"
        >
          Validate, identify <strong>PEM/OI</strong>, start safe symptom relief,
          order targeted workup, and create a follow-up + crash-prevention plan.
        </Callout>
      </div>

      {/* Content */}
      <div className="grid gap-5 p-6">
        <SectionCard
          icon={<HeartPulse className="h-5 w-5 text-emerald-700" />}
          title="Care Principles"
          tint="emerald"
        >
          <Bullets items={q.principles} />
        </SectionCard>

        <SectionCard
          icon={<AlertTriangle className="h-5 w-5 text-rose-700" />}
          title="Avoid (What Not to Do)"
          tint="rose"
        >
          <Bullets items={q.whatNotToDo} />
        </SectionCard>

        <SectionCard
          icon={<ClipboardList className="h-5 w-5 text-violet-700" />}
          title="First-Visit Flow (10–15 min)"
          tint="violet"
        >
          <Bullets items={q.visitFlow} />
        </SectionCard>

        <SectionCard
          icon={<Activity className="h-5 w-5 text-sky-700" />}
          title="PEM — Key Concept"
          tint="sky"
        >
          {q.pemExplainer ? <p>{q.pemExplainer}</p> : null}
        </SectionCard>

        <SectionCard
          icon={<Droplets className="h-5 w-5 text-sky-700" />}
          title="Orthostatic Intolerance (10-minute stand)"
          tint="sky"
        >
          <Bullets items={q.oiSteps} />
        </SectionCard>

        <div className="grid gap-5 md:grid-cols-2">
          <SectionCard
            icon={<Stethoscope className="h-5 w-5 text-slate-700" />}
            title="Baseline Workup & Differentials"
            tint="slate"
          >
            <Bullets items={q.baselineWorkup} />
          </SectionCard>

          <SectionCard
            icon={<Moon className="h-5 w-5 text-emerald-700" />}
            title="Initial Management (Symptom-Directed)"
            tint="emerald"
          >
            <Bullets items={q.initialManagement} />
          </SectionCard>
        </div>

        <SectionCard
          icon={<ClipboardList className="h-5 w-5 text-slate-700" />}
          title="Follow-Up"
          tint="slate"
        >
          <Bullets items={q.followUp} />
        </SectionCard>

        <SectionCard
          icon={<AlertTriangle className="h-5 w-5 text-rose-700" />}
          title="Red Flags — Consider Alternative/Additional Pathways"
          tint="rose"
        >
          <Bullets items={q.redFlags} />
        </SectionCard>

        {/* Smart phrases */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-700" />
            <h3 className="text-lg font-semibold text-slate-900">
              Smart Phrases (Copy-Paste)
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <CopyBlock label="Assessment" text={doc.assessment} />
            <CopyBlock label="Plan" text={doc.plan} />
            <CopyBlock label="Accommodations" text={doc.accommodations} />
          </div>
        </div>

        {provider?.footer ? (
          <p className="mt-2 text-xs text-slate-600">{provider.footer}</p>
        ) : null}
      </div>
    </article>
  );
}
