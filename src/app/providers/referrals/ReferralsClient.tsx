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

  // Textarea content
  const [text, setText] = useState<string>("");

  // Build dynamic referral note whenever tokens change
  const baseTemplate = useMemo(() => {
    const tpl = r?.template ?? "";
    const today = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return tpl
      .replace("[TODAY]", today)
      .replace("[DEST_CLINIC]", clinic)
      .replace("[PATIENT_NAME]", patientName || "[PATIENT_NAME]")
      .replace("[DOB]", dob || "[DOB]")
      .replace("[REFERRER_NAME]", referrer || "[REFERRER_NAME]");
  }, [r?.template, clinic, patientName, dob, referrer]);

  // Prefill or update text (but preserve manual edits)
  // ✅ Always re-render template when clinic or patient info changes,
  // but only if the user hasn't made manual edits beyond token fields
  useEffect(() => {
    const defaultTemplate = baseTemplate.trim();

    // Detect if user has edited text manually (beyond token replacements)
    const userHasEdited =
      text &&
      !text.includes("[PATIENT_NAME]") &&
      !text.includes("[DOB]") &&
      !text.includes("[REFERRER_NAME]") &&
      !text.includes("[DEST_CLINIC]");

    if (!userHasEdited) {
      setText(defaultTemplate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseTemplate]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.getElementById(
        "referral-ta"
      ) as HTMLTextAreaElement | null;
      el?.select();
    }
  };

  const fillExample = () => {
    setPatientName("Jane Doe");
    setDob("01/01/1985");
    setReferrer("Dr. Smith");
    setClinic("Bateman Horne Center");
    setText((t) =>
      (t || baseTemplate)
        .replace("[PATIENT_NAME]", "Jane Doe")
        .replace("[DOB]", "01/01/1985")
        .replace("[COGNITIVE_OR_OI]", "orthostatic intolerance (OI)")
        .replace("[ONSET_YEARS]", "2019–2020")
        .replace("[FUNCTIONAL_STATUS]", "predominantly housebound")
        .replace("[FERRITIN]", "18 ng/mL")
        .replace("[VITD]", "20 ng/mL")
        .replace("[B12]", "372 pg/mL")
        .replace("[ANA_TITER/PATTERN]", "1:80 speckled")
        .replace("[UPRIGHT_TOL]", "< 10 min standing, < 30 min sitting")
        .replace("[PEM_DURATION]", "several days")
        .replace("[NOTES]", "frequent crashes after minimal activity")
        .replace("[REFERRER_NAME]", "Dr. Smith")
        .replace("[CLINIC_NAME]", "Example Family Medicine")
        .replace("[CLINIC_PHONE]", "(555) 555-5555")
        .replace("[CLINIC_FAX]", "(555) 555-5556")
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{r?.title ?? "Referrals"}</h1>
          <div className="flex gap-2">
            <button
              onClick={fillExample}
              className="rounded-md border border-white/70 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition"
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
              onChange={(e) => setPatientName(e.target.value)}
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
              onChange={(e) => setDob(e.target.value)}
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
              onChange={(e) => setReferrer(e.target.value)}
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
              onChange={(e) => setClinic(e.target.value)}
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
            className="rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700 transition"
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
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[420px] p-4 font-mono text-[13px] leading-6 outline-none"
          spellCheck={false}
        />
      </section>

      <p className="text-xs text-slate-500">{footer}</p>
    </div>
  );
}
