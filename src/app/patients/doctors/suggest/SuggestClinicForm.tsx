"use client";

import { useState } from "react";

type Form = {
  name: string; // submitter (optional)
  email: string; // submitter (optional)
  clinic: string; // required
  city: string;
  state: string;
  country: string; // required
  website: string;
  phone: string;
  focuses: string;
  notes: string;
  website_hp: string; // honeypot
};

const cleanUrl = (v: string) => {
  const s = v.trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
};

export default function SuggestClinicForm() {
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
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
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string | null>(null);

  function update<K extends keyof Form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.website_hp) return; // bot

    // minimal client validation
    if (!form.clinic.trim() || !form.country.trim()) {
      setErr("Clinic name and country are required.");
      setOk(false);
      return;
    }

    setSubmitting(true);
    setErr(null);
    setOk(null);
    try {
      const payload: Form = {
        ...form,
        clinic: form.clinic.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        focuses: form.focuses.trim(),
        notes: form.notes.trim(),
        website: cleanUrl(form.website),
      };

      const res = await fetch("/api/clinics/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false)
        throw new Error(data?.error || "Unable to submit");

      setOk(true);
      setForm({
        name: "",
        email: "",
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
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
      setOk(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
      {/* Submitter (optional) */}
      <input
        placeholder="Your name (optional)"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
        value={form.name}
        onChange={update("name")}
        autoComplete="name"
      />
      <input
        type="email"
        placeholder="Your email (optional)"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
        value={form.email}
        onChange={update("email")}
        autoComplete="email"
      />

      {/* Clinic */}
      <input
        placeholder="Clinic name *"
        required
        className="md:col-span-2 rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
        value={form.clinic}
        onChange={update("clinic")}
      />

      {/* Location */}
      <input
        placeholder="City"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
        value={form.city}
        onChange={update("city")}
        autoComplete="address-level2"
      />
      <input
        placeholder="State/Region"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
        value={form.state}
        onChange={update("state")}
        autoComplete="address-level1"
      />
      <input
        placeholder="Country *"
        required
        className="md:col-span-2 rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
        value={form.country}
        onChange={update("country")}
        autoComplete="country-name"
      />

      {/* Contact */}
      <input
        placeholder="Website"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
        value={form.website}
        onChange={update("website")}
        inputMode="url"
        autoComplete="url"
      />
      <input
        placeholder="Phone"
        className="rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
        value={form.phone}
        onChange={update("phone")}
        inputMode="tel"
        autoComplete="tel"
      />

      {/* Details */}
      <input
        placeholder="Focus areas (e.g., ME/CFS, OI/POTS)"
        className="md:col-span-2 rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
        value={form.focuses}
        onChange={update("focuses")}
      />
      <textarea
        placeholder="Notes (waitlist, referrals, telemed, etc.)"
        className="md:col-span-2 rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand min-h-[90px]"
        value={form.notes}
        onChange={update("notes")}
      />

      {/* Honeypot */}
      <input
        tabIndex={-1}
        autoComplete="off"
        value={form.website_hp}
        onChange={update("website_hp")}
        className="hidden"
        aria-hidden="true"
      />

      {/* Status */}
      {err && <p className="md:col-span-2 text-sm text-red-600">{err}</p>}
      {ok && (
        <p className="md:col-span-2 text-sm text-green-700">
          Thanks! We received your suggestion.
        </p>
      )}

      {/* Submit */}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer inline-flex items-center justify-center rounded-md px-4 py-2 font-semibold
                     bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit suggestion"}
        </button>
      </div>
    </form>
  );
}
