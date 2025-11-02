// src/lib/papers/europePmc.ts
// Europe PMC client helper for fetching paper metadata by PMID.
// Calls our Next.js API route: /api/papers/external/pmc/[pmid]

export type EuropePmcPaper = {
  pmid?: string;
  title?: string;
  journal?: string;
  authors?: string;

  // ✅ Primary or fallback source fields from Europe PMC
  pubYear?: string;
  firstPublicationDate?: string;

  // ✅ We normalize to this when returning to UI
  year?: string;

  source?: string;
  link?: string; // DOI if present, else PubMed URL
};

/**
 * Fetch metadata for a single paper from Europe PMC
 * Normalizes year to `year`
 */
export async function fetchEuropePmcPaper(
  pmid: string
): Promise<EuropePmcPaper | null> {
  if (!pmid || !/^\d+$/.test(pmid)) return null;

  try {
    const res = await fetch(`/api/papers/external/pmc/${pmid}`);
    if (!res.ok) return null;

    const data = (await res.json()) as EuropePmcPaper;

    // ✅ Compute year: Prefer pubYear, fallback to firstPublicationDate
    const unifiedYear =
      data.pubYear ??
      (data.firstPublicationDate
        ? data.firstPublicationDate.slice(0, 4)
        : undefined);

    return {
      ...data,
      pmid,
      year: unifiedYear,
    };
  } catch {
    return null;
  }
}
