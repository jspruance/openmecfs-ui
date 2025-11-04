import Link from "next/link";
import ResearchHero from "./ResearchHero";
import LiveGraphCard from "@/components/cards/LiveGraphCard";
import LatestInsightsCard from "@/components/cards/LatestInsightsCard";
import BiomarkerRibbon from "@/components/cards/BiomarkerRibbon";

export default function ResearchIndexPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <ResearchHero />

      {/* Live Engine Tiles */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveGraphCard />
        </div>
        <div>
          <LatestInsightsCard />
        </div>
      </section>

      <section>
        <BiomarkerRibbon />
      </section>

      {/* Keep brochure cards but push them below so the page feels "alive first" */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 border-t">
        <Link
          href="/research/papers"
          className="cursor-pointer block rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
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
          className="cursor-pointer block rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
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
          className="cursor-pointer block rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Mechanisms Atlas
          </h3>
          <p className="mt-1 text-gray-600 text-sm">
            Map proposed ME/CFS mechanisms and associated evidence.
          </p>
        </Link>
      </section>
    </div>
  );
}
