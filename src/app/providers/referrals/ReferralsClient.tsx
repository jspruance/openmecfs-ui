"use client";

import { useEffect, useMemo, useState } from "react";
import type { Referrals } from "@/lib/providerContent";

const CLINIC_OPTIONS = [
  "Stanford Health Care — ME/CFS / Post-Infectious Clinic",
  "INIM (Institute for Neuro-Immune Medicine, NSU)",
  "Bateman Horne Center",
  "Center for Complex Diseases",
  "Charité Fatigue Center",
];

export default function ReferralsClient({
  r,
  footer,
}: {
  r: Referrals;
  footer: string;
}) {
  // Selected destination clinic
  const [clinic, setClinic] = useState<string>(
    r?.defaultClinic && CLINIC_OPTIONS.includes(r.defaultClinic)
      ? r.defaultClinic
      : CLINIC_OPTIONS[0]
  );

  // Optional patient and clinician info
  const [patientName, setPatientName] = useState("");
  const [dob, setDob] = useState("");
  const [referrer, setReferrer] = useState("");

  // Textarea content and "user edited" flag
  const [text, setText] = useState<string>("");
  const [dirty, setDirty] = useState(false); // true only when user types in the textarea

  // Render function from the SOURCE template (never the rendered text)
  const renderedTemplate = useMemo(() => {
    const tpl = (r?.template ?? "").trim();
    const today = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Replace ALL occurrences, not just the first
    const replaceAll = (s: string, find: string, value: string) =>
      s.split(find).join(value);

    let out = tpl;
    out = replaceAll(out, "[TODAY]", today);
    out = replaceAll(out, "[DEST_CLINIC]", clinic);
    out = replaceAll(out, "[PATIENT_NAME]", patientName || "[PATIENT_NAME]");
    out = replaceAll(out, "[DOB]", dob || "[DOB]");
    out = replaceAll(out, "[REFERRER_NAME]", referrer || "[REFERRER_NAME]");

    return out;
  }, [r?.template, clinic, patientName, dob, referrer]);

  // Keep the textarea in sync with inputs unless the user has manually edited it
  useEffect(() => {
    if (!dirty) {
      setText(renderedTemplate);
    }
  }, [renderedTemplate, dirty]);

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDirty(true); // user typed → freeze auto-renders
    setText(e.target.value);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.getElementById(
        "referral-ta"
      ) as HTMLTextAreaElement | null;
      el?.select();
      document.execCommand?.("copy");
    }
  };

  const fillExample = () => {
    // Update tokens
    setPatientName("Jane Doe");
    setDob("01/01/1985");
    setReferrer("Dr. Smith");
    setClinic("Bateman Horne Center");

    // This is a programmatic fill → allow auto-render from template
    setDirty(false);

    // If you also want to prefill additional optional tokens that exist only in the template,
    // you can do it by letting the effect re-render from the template, then (optionally) replace:
    // (No need to do string replace here; the effect will rebuild from r.template)
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#1E88E5] text-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{r?.title ?? "Referrals"}</h1>
          <div className="flex gap-2">
            <button
              onClick={fillExample}
              className="cursor-pointer rounded-md border border-white/70 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition"
            >
              Fill Example
            </button>
            <button
              onClick={copyToClipboard}
              className="rounded-md bg-white/95 text-blue-900 px-3 py-1.5 text-sm font-semibold hover:scale-[1.02] transition"
            >
              Copy
            </button>
          </div>
        </div>
        {r?.intro ? (
          <p className="mt-2 text-blue-50 max-w-3xl">{r.intro}</p>
        ) : null}
      </header>

      {/* Patient Info Inputs */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Patient Name (optional)
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => {
                setPatientName(e.target.value);
                setDirty(false); // keep auto-sync as long as user isn't editing textarea
              }}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Date of Birth (optional)
            </label>
            <input
              type="text"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setDirty(false);
              }}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="MM/DD/YYYY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Referring Clinician (optional)
            </label>
            <input
              type="text"
              value={referrer}
              onChange={(e) => {
                setReferrer(e.target.value);
                setDirty(false);
              }}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="e.g. Dr. Smith"
            />
          </div>
        </div>
      </div>

      {/* Referral Template Editor */}
      <section className="rounded-xl border border-slate-200 bg-white p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-sm text-slate-700">Destination clinic</label>
            <select
              value={clinic}
              onChange={(e) => {
                setClinic(e.target.value);
                // keep auto-sync unless user already typed in textarea
                // (do NOT set dirty here)
              }}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
            >
              {CLINIC_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={copyToClipboard}
            className="rounded-md bg-brand text-white px-3 py-1.5 text-sm hover:bg-brand-dark transition"
          >
            Copy to clipboard
          </button>
        </div>

        {/* Helper note */}
        <div className="px-4 pt-3 text-xs text-slate-500">
          Auto-updates when clinic or patient info changes. You can freely edit
          the text below before copying.
        </div>

        {/* Textarea */}
        <textarea
          id="referral-ta"
          value={text}
          onChange={onTextChange}
          className="w-full min-h-[420px] p-4 font-mono text-[13px] leading-6 outline-none"
          spellCheck={false}
        />
      </section>

      <p className="text-xs text-slate-500">{footer}</p>
    </div>
  );
}
