// Europe PMC paper fetch helper for internal ME/CFS evidence explorer

export type EuropePmcPaper = {
  pmid: string;
  title: string;
  journal?: string;
  year?: string;
  authors?: string;
  abstract?: string;
  link: string;
};

export async function fetchEuropePmcPaper(
  pmid: string
): Promise<EuropePmcPaper | null> {
  if (!pmid || !/^\d+$/.test(pmid)) return null;

  try {
    const res = await fetch(`/api/papers/external/pmc/${pmid}`, {
      next: { revalidate: 3600 }, // cache 1h to avoid hammering API
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data) return null;

    return {
      pmid,
      title: data.title?.trim() || "",
      journal: data.journal?.trim() || "",
      year: data.year?.toString() || "",
      authors: data.authors?.trim() || "",
      abstract: data.abstract?.trim() || "",
      link: data.link,
    };
  } catch (err) {
    console.error(`❌ Europe PMC fetch failed for PMID ${pmid}`, err);
    return null;
  }
}
