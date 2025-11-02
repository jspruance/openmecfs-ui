// src/lib/papers/europePmc.ts
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
    const res = await fetch(`/api/papers/external/pmc/${pmid}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.title) return null;

    const authors =
      data?.authorList?.author?.length > 0
        ? data.authorList.author
            .map((a: { fullName?: string }) => a?.fullName?.trim())
            .filter(Boolean)
            .join(", ")
        : undefined;

    return {
      pmid,
      title: data.title,
      journal: data.journalTitle ?? "",
      year: data.pubYear ?? data.firstPublicationDate?.slice(0, 4) ?? "",
      authors,
      abstract: data.abstractText ?? "",
      link: data.doi
        ? `https://doi.org/${data.doi}`
        : `https://pubmed.ncbi.nlm.nih.gov/${pmid}`,
    };
  } catch (err) {
    console.error(`❌ Europe PMC fetch failed for PMID ${pmid}`, err);
    return null;
  }
}
