import { NextResponse } from "next/server";

const PMC_SEARCH = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";
const PUBMED_XML = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";

interface PaperResult {
  pmid: string;
  title: string;
  journal: string;
  year: string;
  authors: string;
  abstract: string;
  link: string;
  source: string;
}

async function fetchPMC(pmid: string, core = false) {
  const url = `${PMC_SEARCH}?query=EXT_ID:${pmid}${
    core ? "&resultType=core" : ""
  }&format=json`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  return data?.resultList?.result?.[0] || null;
}

async function fetchPubMedXML(pmid: string) {
  try {
    const url = `${PUBMED_XML}?db=pubmed&id=${pmid}&retmode=xml`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const xml = await res.text();

    // Helper to extract text content of a tag
    const tag = (name: string) =>
      xml.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`))?.[1]?.trim();

    const title = tag("ArticleTitle");
    const journal = tag("Title");
    const year = xml.match(/<Year>(\d{4})<\/Year>/)?.[1];
    const abstract = xml
      .match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/)?.[1]
      ?.trim();

    // Parse author names
    const authors: string[] = [];
    const regex = /<Author>([\s\S]*?)<\/Author>/g;
    let match;
    while ((match = regex.exec(xml))) {
      const last = match[1].match(/<LastName>(.*?)<\/LastName>/)?.[1];
      const fore = match[1].match(/<ForeName>(.*?)<\/ForeName>/)?.[1];
      if (last && fore) authors.push(`${fore} ${last}`);
    }

    return {
      title,
      journal,
      year,
      authors: authors.length ? authors.join(", ") : undefined,
      abstract,
      link: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      source: "PUBMED",
    };
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ pmid: string }> }
) {
  const { pmid } = await context.params;

  if (!pmid) {
    return NextResponse.json({ error: "PMID is required" }, { status: 400 });
  }

  try {
    // 1) Normal PMC
    let doc = await fetchPMC(pmid);

    // 2) PMC core
    if (!doc) doc = await fetchPMC(pmid, true);

    // Base structure from PMC
    let result: PaperResult | null = doc
      ? {
          pmid,
          title: doc.title?.trim() || "",
          journal: doc.journalTitle?.trim() || "",
          year:
            doc.pubYear?.toString() ||
            doc.firstPublicationDate?.slice(0, 4) ||
            "",
          authors: doc.authorString?.trim() || "",
          abstract: doc.abstractText?.trim() || "",
          link: doc.doi
            ? `https://doi.org/${doc.doi}`
            : `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
          source: doc.source || "PMC",
        }
      : null;

    const missing =
      !result ||
      !result.title ||
      !result.abstract ||
      !result.authors ||
      !result.journal;

    if (missing) {
      console.warn(
        `⚠️ Missing fields for ${pmid}. Fetching PubMed fallback...`
      );
      const fb = await fetchPubMedXML(pmid);

      if (fb) {
        // Merge PMC + fallback, keep PMC if present
        result = {
          pmid,
          title: result?.title || fb.title || "Title unavailable",
          journal: result?.journal || fb.journal || "Unknown journal",
          year: result?.year || fb.year || "n.d.",
          authors: result?.authors || fb.authors || "Unknown authors",
          abstract: result?.abstract || fb.abstract || "",
          link: fb.link,
          source: fb.source,
        };
      }
    }

    if (!result) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json(result, {
      // cache API layer for 1h
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("❌ PMC route error", err);
    return NextResponse.json(
      { error: "Failed to fetch paper" },
      { status: 500 }
    );
  }
}
