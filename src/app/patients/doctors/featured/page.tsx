"use client";

import { useEffect, useState } from "react";
import ClinicCard, { ClinicType } from "../_components/ClinicCard";

export default function FeaturedClinicsPage() {
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState<ClinicType[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/clinics?featured=1", {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok || !data?.ok)
          throw new Error(data?.error || "Failed to load featured clinics");
        if (mounted) setClinics(data.clinics || []);
      } catch (e: unknown) {
        if (mounted) setErr(e instanceof Error ? e.message : "Unexpected error.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">
            <span className="mr-2">⭐</span> Featured Clinics
          </h1>
          <p className="text-gray-600 mt-1">
            A curated starting list of notable ME/CFS and autonomic (OI/POTS)
            clinics.
          </p>
        </header>

        {loading ? (
          <div className="rounded-xl border border-gray-200 p-8 text-center flex flex-col items-center justify-center text-gray-600">
            {/* Spinner */}
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p>Loading featured clinics…</p>
          </div>
        ) : err ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            {err}
          </div>
        ) : clinics.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-600">
            No featured clinics yet. Mark clinics as <em>Featured</em> in the
            admin screen.
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 gap-6 items-stretch">
            {clinics.map((c) => (
              <li key={c.id} className="h-full">
                <ClinicCard c={c} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
