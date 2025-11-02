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
    // For server components, use full URL in production, relative URL in development
    let apiUrl: string;
    
    if (typeof window === "undefined") {
      // Server-side: construct full URL
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        "http://localhost:3000";
      apiUrl = `${baseUrl}/api/papers/external/pmc/${pmid}`;
    } else {
      // Client-side: use relative URL
      apiUrl = `/api/papers/external/pmc/${pmid}`;
    }

    console.log(`[fetchEuropePmcPaper] Fetching from: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 },
      cache: "no-store", // Force fresh fetch for debugging
    });

    if (!res.ok) {
      console.warn(`⚠️ API returned ${res.status} for ${pmid}`);
      // Try PubMed fallback if API fails
      const fb = await fetchPubmedFallback(pmid);
      if (fb && fb.title) {
        return {
          pmid,
          title: fb.title,
          journal: fb.journal || "Unknown journal",
          year: fb.year || "n.d.",
          authors: fb.authors || "Unknown authors",
          abstract: fb.abstract || "",
          link: fb.link,
        };
      }
      return null;
    }

    const data = await res.json();

    // Check if we got an error response
    if (data.error) {
      console.warn(`⚠️ API error for ${pmid}: ${data.error}`);
      const fb = await fetchPubmedFallback(pmid);
      if (fb && fb.title) {
        return {
          pmid,
          title: fb.title,
          journal: fb.journal || "Unknown journal",
          year: fb.year || "n.d.",
          authors: fb.authors || "Unknown authors",
          abstract: fb.abstract || "",
          link: fb.link,
        };
      }
      return null;
    }

    console.log(`[fetchEuropePmcPaper] API response for ${pmid}:`, {
      hasTitle: !!data?.title,
      hasAbstract: !!data?.abstract,
      hasAuthors: !!data?.authors,
      hasJournal: !!data?.journal,
      title: data?.title?.substring(0, 50),
    });

    const cleaned = {
      pmid,
      title: (data?.title?.trim() || "") as string,
      journal: (data?.journal?.trim() || "") as string,
      year: (data?.year?.toString() || "") as string,
      authors: (data?.authors?.trim() || "") as string,
      abstract: (data?.abstract?.trim() || "") as string,
      link:
        (data?.link?.trim() ||
          (pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : "")) as string,
    };

    const missingKeyFields =
      !cleaned.title ||
      !cleaned.abstract ||
      !cleaned.authors ||
      !cleaned.journal;

    if (missingKeyFields) {
      console.warn(
        `⚠️ Missing fields from PMC for ${pmid}, fetching PubMed fallback. Missing:`,
        {
          title: !cleaned.title,
          abstract: !cleaned.abstract,
          authors: !cleaned.authors,
          journal: !cleaned.journal,
        }
      );

      const fb = await fetchPubmedFallback(pmid);

      if (fb && fb.title) {
        console.log(`[fetchEuropePmcPaper] Using PubMed fallback for ${pmid}`);
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
      
      console.warn(`[fetchEuropePmcPaper] Fallback also failed for ${pmid}`);
    } else {
      console.log(`[fetchEuropePmcPaper] Successfully fetched data for ${pmid}`);
    }

    // Return cleaned data even if some fields are missing
    // The page component will show defaults for empty strings
    return cleaned;
  } catch (err) {
    console.error(`❌ Europe PMC fetch failed for PMID ${pmid}`, err);
    // Last resort: try PubMed fallback
    try {
      const fb = await fetchPubmedFallback(pmid);
      if (fb && fb.title) {
        return {
          pmid,
          title: fb.title,
          journal: fb.journal || "Unknown journal",
          year: fb.year || "n.d.",
          authors: fb.authors || "Unknown authors",
          abstract: fb.abstract || "",
          link: fb.link,
        };
      }
    } catch {
      // Ignore fallback errors
    }
    return null;
  }
}
