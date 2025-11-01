import Link from "next/link";

export default function ResearchHero() {
  return (
    <header className="rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#1E88E5] text-white p-8 mb-8 shadow-sm">
      <h1 className="text-3xl font-bold">Open ME/CFS Research Lab</h1>

      <p className="mt-2 text-blue-50 max-w-2xl">
        Explore ME/CFS research, biological subtypes, biomarkers, mechanisms,
        treatment hypotheses, and AI-powered discovery tools.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/research/papers"
          className="cursor-pointer rounded-md bg-white/95 text-blue-900 px-4 py-2 font-semibold hover:scale-[1.02] transition"
        >
          Papers
        </Link>

        <Link
          href="/research/subtypes"
          className="cursor-pointer rounded-md border border-white/70 text-white px-4 py-2 hover:bg-white/10 transition"
        >
          Subtypes
        </Link>

        <Link
          href="/research/mechanisms"
          className="cursor-pointer rounded-md border border-white/70 text-white px-4 py-2 hover:bg-white/10 transition"
        >
          Mechanisms
        </Link>

        <Link
          href="/research/biomarkers"
          className="cursor-pointer rounded-md border border-white/70 text-white px-4 py-2 hover:bg-white/10 transition"
        >
          Biomarkers
        </Link>

        <Link
          href="/research/treatments"
          className="cursor-pointer rounded-md border border-white/70 text-white px-4 py-2 hover:bg-white/10 transition"
        >
          Treatments
        </Link>

        <Link
          href="/research/hypotheses"
          className="cursor-pointer rounded-md border border-white/70 text-white px-4 py-2 hover:bg-white/10 transition"
        >
          AI Hypotheses
        </Link>
      </div>
    </header>
  );
}
