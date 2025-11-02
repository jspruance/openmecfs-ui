import { NextResponse } from "next/server";

/**
 * Europe PMC Paper Fetch
 *
 * Purpose:
 *  - Fetch live metadata for biomedical papers by PMID
 *  - Used when clicking Mechanism "View Evidence"
 *  - Complements internal curated DB
 *
 * API:
 *  https://www.ebi.ac.uk/europepmc/
 */

const BASE_URL = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";

export async function GET(
  req: Request,
  context: { params: Promise<{ pmid: string }> }
) {
  const { pmid } = await context.params;
  if (!pmid) {
    return NextResponse.json({ error: "PMID is required" }, { status: 400 });
  }

  try {
    // ✅ MEDLINE_ID = correct query key for PUBMED identifiers
    const url = `${BASE_URL}?query=MEDLINE_ID:${pmid}&format=json`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Europe PMC request failed`);
    }

    const data = await res.json();
    const doc = data?.resultList?.result?.[0];

    if (!doc) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({
      pmid,
      title: doc.title ?? "Title unavailable",
      journal: doc.journalTitle ?? null,
      year:
        doc.pubYear ??
        (doc.firstPublicationDate
          ? doc.firstPublicationDate.slice(0, 4)
          : null),
      authors: doc.authorString ?? null,
      abstract: doc.abstractText ?? null,
      source: doc.source ?? "PUBMED",
      link: doc.doi
        ? `https://doi.org/${doc.doi}`
        : `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch paper" },
      { status: 500 }
    );
  }
}
