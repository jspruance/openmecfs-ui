import { fetchEuropePmcPaper } from "@/lib/papers/europePmc";

export default async function PaperPage({
  params,
}: {
  params: { pmid: string };
}) {
  const data = await fetchEuropePmcPaper(params.pmid);

  const title = data?.title || "Title unavailable";
  const abstract = data?.abstract || "Abstract not available.";
  const journal = data?.journal || "Unknown journal";
  const year = data?.year || "n.d.";
  const authors = data?.authors || "Unknown authors";
  const source = data?.source || "External";

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        📄 Paper Details — {params.pmid}
      </h1>

      <div className="mt-4 rounded-lg border p-4 bg-white dark:bg-slate-900">
        <div className="text-xl font-medium">{title}</div>

        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {authors}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {journal} • {year}
        </div>

        <span className="mt-2 inline-block px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
          {source}
        </span>

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
