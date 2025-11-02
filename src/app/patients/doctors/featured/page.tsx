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
        setErr(null);
        console.log("[Featured] Fetching clinics...");
        const res = await fetch("/api/clinics?featured=1", {
          cache: "no-store",
        });
        
        console.log("[Featured] Response status:", res.status, res.ok);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          const errorMsg = errorData?.error || `Failed to load featured clinics (${res.status})`;
          console.error("[Featured] HTTP error:", res.status, errorMsg);
          throw new Error(errorMsg);
        }
        
        const data = await res.json();
        console.log("[Featured] API response:", { ok: data?.ok, clinicCount: data?.clinics?.length, error: data?.error });
        
        if (!data?.ok) {
          const errorMsg = data?.error || "Failed to load featured clinics";
          console.error("[Featured] API error:", errorMsg);
          throw new Error(errorMsg);
        }
        
        if (mounted) {
          const clinicList = Array.isArray(data.clinics) ? data.clinics : [];
          console.log("[Featured] Loaded clinics:", clinicList.length);
          setClinics(clinicList);
        }
      } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : "Unexpected error.";
        console.error("[Featured] Fetch failed:", e);
        if (mounted) setErr(errorMsg);
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
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
            <p className="font-semibold mb-2">⚠️ Error loading featured clinics</p>
            <p className="text-sm">{err}</p>
            <p className="text-sm mt-2 text-red-700">
              Please check the browser console for more details or try refreshing the page.
            </p>
            <details className="mt-3 text-xs">
              <summary className="cursor-pointer text-red-700 hover:text-red-900">
                Technical details
              </summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-red-900 overflow-auto">
                {err}
              </pre>
            </details>
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
