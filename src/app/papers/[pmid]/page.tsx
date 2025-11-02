import { fetchEuropePmcPaper } from "@/lib/papers/europePmc";

export default async function PaperPage({
  params,
}: {
  params: Promise<{ pmid: string }>;
}) {
  const { pmid } = await params;
  const data = await fetchEuropePmcPaper(pmid);

  const title = data?.title || "Title unavailable";
  const abstract = data?.abstract || "Abstract not available.";
  const journal = data?.journal || "Unknown journal";
  const year = data?.year || "n.d.";
  const authors = data?.authors || "Unknown authors";

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        📄 Paper Details — {pmid}
      </h1>

      <div className="mt-4 rounded-lg border p-4 bg-white dark:bg-slate-900">
        <div className="text-xl font-medium">{title}</div>

        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {authors}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {journal} • {year}
        </div>

        <h2 className="mt-6 font-semibold">Abstract</h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
          {abstract}
        </p>

        {data?.link && (
          <a
            href={data.link}
            target="_blank"
            className="mt-4 inline-block text-blue-600 dark:text-blue-400 underline underline-offset-2"
          >
            View on Europe PMC →
          </a>
        )}
      </div>
    </div>
  );
}
