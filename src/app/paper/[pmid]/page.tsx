// src/app/paper/[pmid]/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";

type Paper = {
  pmid?: string;
  title?: string;
  authors?: string[];
  year?: number;
  journal?: string;
  keywords?: string[];
  abstract?: string;
  technical_summary?: string;
  patient_summary?: string;
};

export const metadata: Metadata = {
  title: "Research Paper — Open ME/CFS",
};

async function fetchPaper(pmid: string): Promise<Paper | null> {
  // Build absolute URL that works in prod and dev
  const h = await headers();
  const host =
    h.get("x-forwarded-host") ?? h.get("host") ?? process.env.VERCEL_URL ?? "";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? `${proto}://${host}`;

  try {
    const res = await fetch(`${base}/api/papers/${pmid}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Paper;
  } catch {
    return null;
  }
}

export default async function PaperPage({
  params,
}: {
  // Next.js 15: params is a Promise
  params: Promise<{ pmid: string }>;
}) {
  const { pmid } = await params;
  const paper = await fetchPaper(pmid);

  if (!paper) {
    return (
      <main className="p-6">
        <p className="text-slate-600">Paper not found.</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{paper.title}</h1>
      <p className="text-sm text-slate-600">
        {paper.journal ? `${paper.journal} • ` : ""}
        {paper.year ?? ""}
        {paper.pmid ? ` • PMID: ${paper.pmid}` : ""}
      </p>

      {paper.authors?.length ? (
        <p className="text-slate-700">{paper.authors.join(", ")}</p>
      ) : null}

      {paper.abstract && (
        <>
          <h2 className="text-lg font-semibold">Abstract</h2>
          <p className="text-slate-800">{paper.abstract}</p>
        </>
      )}

      {paper.technical_summary && (
        <>
          <h2 className="text-lg font-semibold">Technical summary</h2>
          <p className="text-slate-800 whitespace-pre-wrap">
            {paper.technical_summary}
          </p>
        </>
      )}

      {paper.patient_summary && (
        <>
          <h2 className="text-lg font-semibold">Patient-friendly summary</h2>
          <p className="text-slate-800 whitespace-pre-wrap">
            {paper.patient_summary}
          </p>
        </>
      )}

      {paper.keywords?.length ? (
        <div className="flex flex-wrap gap-2 pt-2">
          {paper.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700"
            >
              {k}
            </span>
          ))}
        </div>
      ) : null}
    </main>
  );
}
