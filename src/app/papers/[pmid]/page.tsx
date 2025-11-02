import { fetchEuropePmcPaper, type EuropePmcPaper } from "@/lib/papers/europePmc";

interface Props {
  params: Promise<{ pmid: string }>;
}

export default async function PaperPage({ params }: Props) {
  const { pmid } = await params;

  let paper: EuropePmcPaper | null = null;
  try {
    paper = await fetchEuropePmcPaper(pmid);
  } catch (e) {
    console.error("Error fetching Europe PMC data:", e);
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-4">📄 Paper Details — {pmid}</h1>

      {/* Title */}
      <h2 className="text-xl font-bold mb-2">
        {paper?.title || "Title unavailable"}
      </h2>

      {/* Year & Source */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        {paper?.year ? `Published ${paper.year}` : ""}
        {paper?.source ? ` • ${paper.source}` : ""}
      </p>

      {/* Abstract */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Abstract</h3>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {paper?.abstract || "Abstract not available."}
        </p>
      </div>

      {/* External Link */}
      <a
        href={`https://europepmc.org/article/MED/${pmid}`}
        target="_blank"
        className="
          inline-block mt-6 text-blue-600 dark:text-blue-400 underline 
          underline-offset-2 cursor-pointer
        "
      >
        View on Europe PMC →
      </a>
    </main>
  );
}
