import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

type Paper = {
  pmid: string;
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

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { pmid: string } }
) {
  try {
    const file = path.join(process.cwd(), "public", "data", "papers.json");
    const raw = await fs.readFile(file, "utf-8");
    const all = JSON.parse(raw) as Paper[];

    const paper = all.find((p) => p.pmid === params.pmid);
    if (!paper) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(paper, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
