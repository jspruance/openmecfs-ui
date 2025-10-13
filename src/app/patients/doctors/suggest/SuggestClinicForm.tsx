"use client";

import { useState } from "react";

export default function SuggestClinicForm() {
  const [form, setForm] = useState({
    name: "",
    clinic: "",
    city: "",
    state: "",
    country: "",
    website: "",
    phone: "",
    focuses: "",
    notes: "",
    website_hp: "", // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    setOk(null);
    try {
      const res = await fetch("/api/clinics/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok)
        throw new Error(data?.error || "Unable to submit");
      setOk(true);
      setForm({
        name: "",
        clinic: "",
        city: "",
        state: "",
        country: "",
        website: "",
        phone: "",
        focuses: "",
        notes: "",
        website_hp: "",
      });
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
      setOk(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
      <input
        placeholder="Your name (optional)"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Clinic name *"
        required
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        value={form.clinic}
        onChange={(e) => setForm({ ...form, clinic: e.target.value })}
      />

      <input
        placeholder="City"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />
      <input
        placeholder="State/Region"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        value={form.state}
        onChange={(e) => setForm({ ...form, state: e.target.value })}
      />

      <input
        placeholder="Country *"
        required
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        value={form.country}
        onChange={(e) => setForm({ ...form, country: e.target.value })}
      />
      <input
        placeholder="Website"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />

      <input
        placeholder="Phone"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        placeholder="Focus areas (e.g., ME/CFS, OI/POTS)"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        value={form.focuses}
        onChange={(e) => setForm({ ...form, focuses: e.target.value })}
      />

      <textarea
        placeholder="Notes (waitlist, referrals, telemed, etc.)"
        className="md:col-span-2 rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 min-h-[90px]"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      {/* Honeypot (hidden) */}
      <input
        tabIndex={-1}
        autoComplete="off"
        value={form.website_hp}
        onChange={(e) => setForm({ ...form, website_hp: e.target.value })}
        className="hidden"
        aria-hidden="true"
      />

      {err && <p className="md:col-span-2 text-sm text-red-600">{err}</p>}
      {ok && (
        <p className="md:col-span-2 text-sm text-green-700">
          Thanks! We received your suggestion.
        </p>
      )}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer inline-flex items-center justify-center rounded-md px-4 py-2 font-semibold
                     bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit suggestion"}
        </button>
      </div>
    </form>
  );
}
