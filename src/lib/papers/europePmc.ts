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

    return {
      pmid,
      title: data.title,
      journal: data.journalTitle,
      year: data.pubYear ?? data.firstPublicationDate?.slice(0, 4),
      authors: data.authorList?.author?.map((a: any) => a.fullName).join(", "),
      abstract: data.abstractText ?? "",
      link: data.doi
        ? `https://doi.org/${data.doi}`
        : `https://pubmed.ncbi.nlm.nih.gov/${pmid}`,
    };
  } catch {
    return null;
  }
}
