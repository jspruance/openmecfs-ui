// app/patients/doctors/directory/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ClinicType } from "../_components/ClinicCard";

/* -------------------------- Constants & helpers --------------------------- */
const COUNTRIES = ["All", "USA", "Canada", "UK", "Germany", "Other"] as const;

const US_STATES = [
  "All",
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VT",
  "WA",
  "WI",
  "WV",
  "WY",
] as const;

/* --------------------------------- Page ---------------------------------- */
export default function DoctorsDirectoryPage() {
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState<ClinicType[]>([]);

  const [q, setQ] = useState("");
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]>("All");
  const [stateCode, setStateCode] = useState<(typeof US_STATES)[number]>("All");
  const [onlyAutonomic, setOnlyAutonomic] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "country">("name");

  // Fetch clinics from your API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/clinics", { cache: "no-store" });
        const data = await res.json();
        if (mounted && data?.ok) setClinics(data.clinics || []);
      } catch (e) {
        console.error("Load clinics failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    let list = clinics.filter((c) => {
      // support either camelCase (old UI) or snake_case (DB)
      const auto = (c as any).autonomicFocused ?? c.autonomic_focused ?? false;

      if (onlyAutonomic && !auto) return false;
      if (country !== "All" && c.country !== country) return false;
      if (country === "USA" && stateCode !== "All" && c.state !== stateCode)
        return false;

      if (!needle) return true;

      const hay = [
        c.name,
        c.city || "",
        c.state || "",
        c.country,
        Array.isArray(c.tags) ? c.tags.join(" ") : "",
        c.notes || "",
      ]
        .join(" • ")
        .toLowerCase();

      return hay.includes(needle);
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      const cc = a.country.localeCompare(b.country);
      return cc !== 0 ? cc : a.name.localeCompare(b.name);
    });

    return list;
  }, [q, country, stateCode, onlyAutonomic, sortBy, clinics]);

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Clinicians & Centers — Directory
            </h1>
            <p className="text-gray-600 mt-1">
              Search for ME/CFS-aware clinicians and autonomic (OI/POTS)
              specialists. This list is community-curated—availability varies,
              waitlists are common.
            </p>

            {/* Quick cross-links */}
            <div className="mt-2 flex items-center gap-4">
              <Link
                href="/patients/doctors"
                className="cursor-pointer text-sm text-pink-700 hover:underline"
              >
                ⭐ Featured clinics
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/patients/doctors/suggest"
                className="cursor-pointer text-sm text-blue-700 hover:underline"
              >
                Suggest a clinic
              </Link>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
          <div className="grid lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Clinic or city, e.g., bateman or berlin…"
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => {
                  const val = e.target.value as (typeof COUNTRIES)[number];
                  setCountry(val);
                  if (val !== "USA") setStateCode("All");
                }}
                className="cursor-pointer w-full rounded-md border border-gray-200 px-3 py-2 bg-white focus:border-blue-500 focus:ring-blue-500"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* State (USA) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State (USA)
              </label>
              <select
                value={stateCode}
                onChange={(e) =>
                  setStateCode(e.target.value as (typeof US_STATES)[number])
                }
                disabled={country !== "USA"}
                className="cursor-pointer w-full rounded-md border border-gray-200 px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              >
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "name" | "country")
                }
                className="cursor-pointer w-full rounded-md border border-gray-200 px-3 py-2 bg-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="name">Name (A–Z)</option>
                <option value="country">Country → Name</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="mt-4 flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={onlyAutonomic}
                onChange={(e) => setOnlyAutonomic(e.target.checked)}
                className="cursor-pointer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Show OI/Autonomic clinics only
            </label>

            {filtered.length > 0 && (
              <span className="ml-auto text-sm text-gray-500">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-600">
            Loading clinics…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid md:grid-cols-2 gap-5">
            {filtered.map((c) => {
              const auto =
                (c as any).autonomicFocused ?? c.autonomic_focused ?? false;

              const addrLines = [
                c.address_line1,
                c.address_line2,
                [c.city, c.state, c.postal_code].filter(Boolean).join(", "),
                c.country,
              ].filter(Boolean) as string[];

              const mapsQuery = encodeURIComponent(
                [
                  c.address_line1,
                  c.address_line2,
                  c.city,
                  c.state,
                  c.postal_code,
                  c.country,
                ]
                  .filter(Boolean)
                  .join(" ")
              );

              return (
                <li
                  key={c.id}
                  className="rounded-2xl border border-gray-200 p-6 hover:shadow-md transition"
                >
                  {/* Balanced 2-col layout inside card */}
                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr),minmax(16rem,18rem)] gap-6">
                    {/* Left column */}
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 break-words">
                        {c.name}
                      </h3>
                      <p className="text-gray-600">
                        {c.city ? `${c.city}, ` : ""}
                        {c.state ? `${c.state}, ` : ""}
                        {c.country}
                      </p>

                      {(c.tags?.length || auto) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(c.tags || []).map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700"
                            >
                              {t}
                            </span>
                          ))}
                          {auto && (
                            <span className="inline-flex items-center rounded-full bg-pink-50 text-pink-700 border border-pink-200 px-2.5 py-1 text-xs">
                              OI/Autonomic
                            </span>
                          )}
                        </div>
                      )}

                      {c.notes && (
                        <p className="mt-2 text-sm text-gray-700">{c.notes}</p>
                      )}

                      {(c.website || c.booking_url || c.email || c.phone) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {c.website && (
                            <a
                              href={c.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50"
                            >
                              Visit site ↗
                            </a>
                          )}
                          {c.booking_url && (
                            <a
                              href={c.booking_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
                            >
                              Book appointment
                            </a>
                          )}
                          {c.email && (
                            <a
                              href={`mailto:${c.email}`}
                              className="cursor-pointer inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 break-all"
                            >
                              {c.email}
                            </a>
                          )}
                          {c.phone && (
                            <a
                              href={`tel:${c.phone}`}
                              className="cursor-pointer inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
                            >
                              {c.phone}
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Address panel */}
                    <aside>
                      {addrLines.length > 0 && (
                        <div className="rounded-xl border border-gray-200 bg-white p-4 h-full">
                          <div className="text-xs font-semibold tracking-wide text-gray-500">
                            ADDRESS
                          </div>
                          <address className="not-italic mt-1 text-sm text-gray-800">
                            {addrLines.map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </address>
                          <div className="mt-2">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer text-blue-700 text-sm hover:underline"
                            >
                              View on Maps ↗
                            </a>
                          </div>
                        </div>
                      )}
                    </aside>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer note */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 text-sm">
          <strong>Heads up:</strong> This directory is informational only and
          not a guarantee of care or outcomes. It isn’t medical advice. Always
          verify current availability, referral requirements, and insurance with
          the clinic.
        </div>
      </section>
    </main>
  );
}

/* ------------------------------ Subcomponents ---------------------------- */
function EmptyState() {
  return (
    <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-600">
      <p className="font-medium">No clinics matched your filters.</p>
      <p className="text-sm mt-1">
        Try clearing search or toggles. We’ll expand this directory over time.
      </p>
      <div className="mt-4">
        <Link
          href="/patients/doctors/suggest"
          className="cursor-pointer inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Suggest a clinic
        </Link>
      </div>
    </div>
  );
}
