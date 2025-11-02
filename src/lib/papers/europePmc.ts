// src/lib/papers/europePmc.ts
// Europe PMC helper with PubMed XML fallback

export type EuropePmcPaper = {
  pmid: string;
  title: string;
  journal?: string;
  year?: string;
  authors?: string;
  abstract?: string;
  link: string;
};

// PubMed fallback XML fetch
async function fetchPubmedFallback(pmid: string) {
  try {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const xml = await res.text();

    const match = (tag: string) =>
      xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim();

    const title = match("ArticleTitle");
    const journal = match("Title");
    const year = xml.match(/<Year>(\d{4})<\/Year>/)?.[1];
    const abstract = xml
      .match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/)?.[1]
      ?.trim();

    const authors: string[] = [];
    const regex = /<Author>([\s\S]*?)<\/Author>/g;
    let m;
    while ((m = regex.exec(xml))) {
      const last = m[1].match(/<LastName>(.*?)<\/LastName>/)?.[1];
      const fore = m[1].match(/<ForeName>(.*?)<\/ForeName>/)?.[1];
      if (last && fore) authors.push(`${fore} ${last}`);
    }

    return {
      title,
      journal,
      year,
      authors: authors.length ? authors.join(", ") : undefined,
      abstract,
      link: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    };
  } catch {
    return null;
  }
}

export async function fetchEuropePmcPaper(
  pmid: string
): Promise<EuropePmcPaper | null> {
  if (!pmid || !/^\d+$/.test(pmid)) return null;

  try {
    // Hit our API (PMC proxy)
    const res = await fetch(`/api/papers/external/pmc/${pmid}`, {
      next: { revalidate: 3600 },
    });
    const data = res.ok ? await res.json() : null;

    const cleaned = {
      pmid,
      title: data?.title?.trim() || "",
      journal: data?.journal?.trim() || "",
      year: data?.year?.toString() || "",
      authors: data?.authors?.trim() || "",
      abstract: data?.abstract?.trim() || "",
      link:
        data?.link || (pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : ""),
    };

    const missingKeyFields =
      !cleaned.title ||
      !cleaned.abstract ||
      !cleaned.authors ||
      !cleaned.journal;

    if (missingKeyFields) {
      console.warn(
        `⚠️ Missing fields from PMC, fetching PubMed fallback for ${pmid}`
      );

      const fb = await fetchPubmedFallback(pmid);

      if (fb) {
        return {
          pmid,
          title: cleaned.title || fb.title || "Title unavailable",
          journal: cleaned.journal || fb.journal || "Unknown journal",
          year: cleaned.year || fb.year || "n.d.",
          authors: cleaned.authors || fb.authors || "Unknown authors",
          abstract: cleaned.abstract || fb.abstract || "",
          link: fb.link,
        };
      }
    }

    return cleaned;
  } catch (err) {
    console.error(`❌ Europe PMC fetch failed for PMID ${pmid}`, err);
    return null;
  }
}
