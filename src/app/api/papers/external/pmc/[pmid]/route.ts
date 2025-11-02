import { NextResponse } from "next/server";

const PMC_BASE = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";
const PUBMED_FALLBACK =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi";

async function fetchEuropePmc(pmid: string, core = false) {
  const url = `${PMC_BASE}?query=EXT_ID:${pmid}${
    core ? "&resultType=core" : ""
  }&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  return data.resultList?.result?.[0] || null;
}

async function fetchPubMedFallback(pmid: string) {
  const url = `${PUBMED_FALLBACK}?db=pubmed&id=${pmid}&retmode=json`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const json = await res.json();
  const doc = json.result?.[pmid];
  if (!doc) return null;

  return {
    title: doc.title,
    journal: doc.fulljournalname,
    year: doc.pubdate?.slice(0, 4),
    authors: doc.authors?.map((a: { name?: string }) => a.name).filter(Boolean).join(", "),
    source: "PUBMED",
    link: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
  };
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
    // 1. Try standard Europe PMC
    let doc = await fetchEuropePmc(pmid);

    // 2. If not found, try `resultType=core`
    if (!doc) doc = await fetchEuropePmc(pmid, true);

    // 3. If still not found, try PubMed fallback
    if (!doc) {
      const fallback = await fetchPubMedFallback(pmid);
      if (fallback) return NextResponse.json({ pmid, ...fallback });

      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    // ✅ Normal PMC return
    return NextResponse.json({
      pmid,
      title: doc.title,
      journal: doc.journalTitle,
      year: doc.pubYear ?? doc.firstPublicationDate?.slice(0, 4),
      authors: doc.authorString,
      source: doc.source,
      abstract: doc.abstractText ?? "",
      link: doc?.doi
        ? `https://doi.org/${doc.doi}`
        : `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch paper" },
      { status: 500 }
    );
  }
}
