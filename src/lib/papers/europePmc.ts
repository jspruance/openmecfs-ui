// src/lib/papers/europePmc.ts
// Europe PMC client helper for fetching paper metadata by PMID.
// This calls our API route at /api/papers/external/pmc/[pmid].
// Used by the Mechanisms Evidence dialog (wiring comes next).

export type EuropePmcPaper = {
  pmid: string;
  title: string;
  journal: string;
  year: string;
  authors: string;
  source?: string;
  link: string; // DOI if present, otherwise PubMed URL
};

export async function fetchEuropePmcPaper(
  pmid: string
): Promise<EuropePmcPaper | null> {
  if (!pmid || !/^\d+$/.test(pmid)) return null;
  try {
    const res = await fetch(`/api/papers/external/pmc/${pmid}`);
    if (!res.ok) return null;
    const data = await res.json();
    // Basic shape guard
    if (!data?.title) return null;
    return data as EuropePmcPaper;
  } catch {
    return null;
  }
}
