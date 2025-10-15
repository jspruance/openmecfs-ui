// src/app/api/papers/[pmid]/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

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
  date?: string; // ISO
};

function safeJSONParse<T>(text: string): T {
  const clean = text.replace(/^\uFEFF/, "");
  return JSON.parse(clean) as T;
}

export async function GET(
  _req: Request,
  context: { params: { pmid: string } }
) {
  try {
    const { pmid } = context.params || { pmid: "" };
    if (!pmid) {
      return NextResponse.json({ error: "Missing pmid" }, { status: 400 });
    }

    const file = path.join(process.cwd(), "public", "data", "papers.json");
    const raw = await fs.readFile(file, "utf-8");
    const all = safeJSONParse<Paper[]>(raw);

    const found = all.find((p) => (p.pmid ?? "") === pmid);
    if (!found) {
      return NextResponse.json(
        { error: `Paper ${pmid} not found` },
        { status: 404 }
      );
    }

    // Return only the fields we expect (defensive)
    const resp: Paper = {
      pmid: found.pmid,
      title: found.title,
      authors: found.authors ?? [],
      year: typeof found.year === "number" ? found.year : undefined,
      journal: found.journal,
      keywords: found.keywords ?? [],
      abstract: found.abstract,
      technical_summary: found.technical_summary,
      patient_summary: found.patient_summary,
      date: found.date,
    };

    return NextResponse.json(resp, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    // Helpful error without using `any`
    let message = "Unknown server error";
    const errObj = e as { code?: unknown; message?: unknown };

    if (typeof errObj?.code === "string" && errObj.code === "ENOENT") {
      message = "Missing file public/data/papers.json";
    } else if (e instanceof SyntaxError) {
      message = "Invalid JSON in public/data/papers.json";
    } else if (typeof errObj?.message === "string") {
      message = errObj.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
