// src/app/api/papers/[pmid]/route.ts
import { NextRequest, NextResponse } from "next/server";
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
  date?: string;
};

function safeJSONParse<T>(text: string): T {
  const clean = text.replace(/^\uFEFF/, "");
  return JSON.parse(clean) as T;
}

async function loadAll(): Promise<Paper[]> {
  const file = path.join(process.cwd(), "public", "data", "papers.json");
  const raw = await fs.readFile(file, "utf-8");
  return safeJSONParse<Paper[]>(raw);
}

export async function GET(
  _req: NextRequest,
  ctx: { params: { [key: string]: string | string[] } }
) {
  try {
    const rawParam = ctx.params.pmid;
    const pmid = Array.isArray(rawParam) ? rawParam[0] : rawParam;

    if (!pmid) {
      return NextResponse.json({ error: "Missing pmid" }, { status: 400 });
    }

    const all = await loadAll();
    const paper = all.find((p) => String(p.pmid) === String(pmid));

    if (!paper) {
      return NextResponse.json(
        { error: `Paper ${pmid} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(paper, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Unknown server error reading papers.json";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
