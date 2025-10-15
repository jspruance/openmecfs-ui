// app/patients/ai-assistant/page.tsx
"use client";

import { useMemo, useState } from "react";
import presets from "./presets.json";
import { Sparkles, Clipboard, Check, RotateCcw } from "lucide-react";

type Preset = { id: string; title: string; body: string };

export default function AiAssistantPage() {
  const [patientInput, setPatientInput] = useState("");
  const [doctorLastname, setDoctorLastname] = useState("");
  const [patientName, setPatientName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  const hydratedDraft = useMemo(() => {
    const rep = (s: string) =>
      s
        .replaceAll("{{DOCTOR_LASTNAME}}", doctorLastname || "______")
        .replaceAll("{{PATIENT_NAME}}", patientName || "______");
    return rep(draft);
  }, [draft, doctorLastname, patientName]);

  const loadPreset = (p: Preset) => {
    setDraft(p.body);
    setPatientInput(p.title); // <-- always update the simple-terms field
  };

  const generate = async () => {
    if (!patientInput) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/doctor-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_input: patientInput,
          doctor_lastname: doctorLastname,
          patient_name: patientName,
        }),
      });
      const data = await res.json();
      setDraft(data.body_md || data.text || "");
    } catch {
      alert("Generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(hydratedDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      alert("Copy failed. Select the text and copy manually.");
    }
  };

  const clearAll = () => {
    setPatientInput("");
    setDoctorLastname("");
    setPatientName("");
    setDraft("");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-2 sm:px-4">
      {/* Header */}
      <header className="mb-6 mt-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1 text-xs text-slate-600 ring-1 ring-inset ring-slate-200">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          AI Health Messaging
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          Message Your Doctor
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Turn your plain-English request into a short, clinician-ready note.
          Pick a quick request or write your own, then copy into your
          portal/email.
        </p>
      </header>

      {/* Presets */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-800">Quick Requests</h2>
          <button
            onClick={() => {
              setDraft("");
              setPatientInput("");
            }} // <-- add setPatientInput("")
            className="cursor-pointer text-xs text-blue-700 hover:underline"
            type="button"
          >
            Clear
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(presets as Preset[]).map((p) => (
            <button
              key={p.id}
              onClick={() => loadPreset(p)}
              type="button"
              className="group cursor-pointer rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-inset ring-slate-200 transition hover:shadow-md hover:ring-slate-300"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[15px] font-medium text-slate-900">
                  {p.title}
                </span>
                <span className="shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 ring-1 ring-inset ring-slate-200 group-hover:ring-slate-300">
                  Preset
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                Click to load a ready-to-send draft (editable below).
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Composer Card */}
      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 ring-1 ring-inset ring-slate-200">
        {/* Top row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-700">
              Doctor’s last name
            </span>
            <input
              className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Smith"
              value={doctorLastname}
              onChange={(e) => setDoctorLastname(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-700">
              Your name
            </span>
            <input
              className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Jonathan Spruance"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </label>

          <div className="flex items-end">
            <button
              onClick={generate}
              disabled={!patientInput || generating}
              type="button"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              title="Generate draft with AI"
            >
              <Sparkles className="h-4 w-4" />
              {generating ? "Generating…" : "Generate with AI"}
            </button>
          </div>
        </div>

        {/* Patient input */}
        <label className="mt-5 block">
          <span className="mb-1 block text-xs font-medium text-slate-700">
            In simple terms (what you want)
          </span>
          <input
            className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., “I’d like to try Low-Dose Naltrexone for ME/CFS.”"
            value={patientInput}
            onChange={(e) => setPatientInput(e.target.value)}
          />
        </label>

        {/* Draft output */}
        <label className="mt-5 block">
          <div className="mb-1 flex items-center justify-between">
            <span className="block text-xs font-medium text-slate-700">
              Draft to copy
            </span>
            <span className="text-[11px] text-slate-500">
              {hydratedDraft.length.toLocaleString()} chars
            </span>
          </div>
          <textarea
            className="h-64 w-full resize-y rounded-xl border-0 bg-white px-3 py-2 text-sm leading-5 text-slate-900 shadow-inner ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={hydratedDraft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Your draft will appear here. You can edit it before copying."
          />
        </label>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={clearAll}
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:ring-slate-300"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </button>

          <button
            onClick={copyDraft}
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Drafts support communication and don’t replace medical advice.
        </p>
      </section>
    </div>
  );
}
