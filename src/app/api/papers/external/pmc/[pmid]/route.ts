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
 *
 * Notes:
 *  - Europe PMC aggregates PubMed + biomedical repos
 *  - We abstract "PubMed" behind PMC endpoint for flexibility
 */

const BASE_URL = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";

export async function GET(
  req: Request,
  { params }: { params: { pmid: string } }
) {
  const { pmid } = params;
  if (!pmid) {
    return NextResponse.json({ error: "PMID is required" }, { status: 400 });
  }

  try {
    const url = `${BASE_URL}?query=EXT_ID:${pmid}&format=json`;
    const res = await fetch(url);
    const data = await res.json();

    const doc = data.resultList?.result?.[0];

    if (!doc) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({
      pmid,
      title: doc.title,
      journal: doc.journalTitle,
      year: doc.pubYear,
      authors: doc.authorString,
      source: doc.source, // PUBMED / PMC / etc
      link: doc?.doi
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
