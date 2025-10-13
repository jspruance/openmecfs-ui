"use client";

import { useState } from "react";
import Link from "next/link";

export const metadata = {
  title: "Suggest a Clinic — Open ME/CFS",
  description: "Recommend an ME/CFS or OI/autonomic clinic for the directory.",
};

export default function SuggestClinicPage() {
  const [form, setForm] = useState({
    // Basics
    clinic: "",
    country: "",
    state: "",
    city: "",
    // New contact/address
    address_line1: "",
    address_line2: "",
    postal_code: "",
    website: "",
    booking_url: "",
    phone: "",
    email: "",
    // Meta
    focuses: "",
    notes: "",
    // Your info (optional)
    your_name: "",
    your_email: "",
    // Honeypot (hidden)
    website_hp: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);
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
        clinic: "",
        country: "",
        state: "",
        city: "",
        address_line1: "",
        address_line2: "",
        postal_code: "",
        website: "",
        booking_url: "",
        phone: "",
        email: "",
        focuses: "",
        notes: "",
        your_name: "",
        your_email: "",
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
    <main className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Suggest a Clinic</h1>
          <p className="text-gray-600 mt-2">
            Know an ME/CFS-aware clinician or an OI/autonomic clinic? Share the
            details below. We’ll review submissions before listing.
          </p>
          <div className="mt-3">
            <Link
              href="/patients/doctors/directory"
              className="cursor-pointer text-blue-700 hover:underline"
            >
              ← Back to Directory
            </Link>
          </div>
        </header>

        <form
          onSubmit={submit}
          className="rounded-xl border border-gray-200 p-5 bg-white grid md:grid-cols-2 gap-4"
        >
          {/* Required */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinic name *
            </label>
            <input
              required
              value={form.clinic}
              onChange={(e) => setForm({ ...form, clinic: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Bateman Horne Center"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <input
              required
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., USA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State/Region
            </label>
            <input
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., CA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Palo Alto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal code
            </label>
            <input
              value={form.postal_code}
              onChange={(e) =>
                setForm({ ...form, postal_code: e.target.value })
              }
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 94304"
            />
          </div>

          {/* Address lines */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address line 1
            </label>
            <input
              value={form.address_line1}
              onChange={(e) =>
                setForm({ ...form, address_line1: e.target.value })
              }
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Street address"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address line 2
            </label>
            <input
              value={form.address_line2}
              onChange={(e) =>
                setForm({ ...form, address_line2: e.target.value })
              }
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Suite, floor, etc."
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://…"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking URL
            </label>
            <input
              value={form.booking_url}
              onChange={(e) =>
                setForm({ ...form, booking_url: e.target.value })
              }
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://…"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="+1 555-123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinic email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="frontdesk@clinic.org"
            />
          </div>

          {/* Meta */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Focus areas (e.g., ME/CFS, OI/POTS)
            </label>
            <input
              value={form.focuses}
              onChange={(e) => setForm({ ...form, focuses: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="ME/CFS, OI/POTS, Long COVID…"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 min-h-[100px] focus:border-blue-500 focus:ring-blue-500"
              placeholder="Waitlist, referral requirements, telemedicine availability, etc."
            />
          </div>

          {/* Your info (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your name (optional)
            </label>
            <input
              value={form.your_name}
              onChange={(e) => setForm({ ...form, your_name: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="So we can follow up if needed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your email (optional)
            </label>
            <input
              type="email"
              value={form.your_email}
              onChange={(e) => setForm({ ...form, your_email: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Honeypot (hidden visually) */}
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.website_hp}
            onChange={(e) => setForm({ ...form, website_hp: e.target.value })}
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
                         bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit clinic"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500">
          Submissions are reviewed for accuracy and availability. This is
          informational, not medical advice.
        </p>
      </section>
    </main>
  );
}
