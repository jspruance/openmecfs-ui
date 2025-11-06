"use client";

import Link from "next/link";
import ResearchHero from "./ResearchHero";

// Live tiles
import LiveGraphCard from "@/components/cards/LiveGraphCard";
//import LatestInsightsCard from "@/components/cards/LatestInsightsCard";
import BiomarkerRibbon from "@/components/cards/BiomarkerRibbon";

export default function ResearchIndexPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <ResearchHero />

      {/* Live Data Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          🔬 Real-time Research Engine
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Global Graph */}
          <div className="lg:col-span-3">
            <LiveGraphCard />
          </div>

          {/* Latest AI insights 
          <div>
            <LatestInsightsCard />
          </div>*/}
        </div>

        {/* Biomarker Activity Ribbon */}
        <div className="mt-6">
          <BiomarkerRibbon />
        </div>
      </section>

      {/* Legacy cards moved below to support exploration */}
      <section className="pt-6 border-t">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          🧭 Explorer Tools
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/research/papers"
            className="cursor-pointer block rounded-xl border border-gray-200 p-5 hover:shadow-md transition bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Papers Database
            </h3>
            <p className="mt-1 text-gray-600 text-sm">
              Explore structured ME/CFS studies, AI summaries, and semantic
              search.
            </p>
          </Link>

          <Link
            href="/research/subtypes"
            className="cursor-pointer block rounded-xl border border-gray-200 p-5 hover:shadow-md transition bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Subtypes Explorer
            </h3>
            <p className="mt-1 text-gray-600 text-sm">
              Discover biologically-driven clusters using AI + UMAP.
            </p>
          </Link>

          <Link
            href="/research/mechanisms"
            className="cursor-pointer block rounded-xl border border-gray-200 p-5 hover:shadow-md transition bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Mechanisms Atlas
            </h3>
            <p className="mt-1 text-gray-600 text-sm">
              Map proposed ME/CFS mechanisms and associated evidence.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
