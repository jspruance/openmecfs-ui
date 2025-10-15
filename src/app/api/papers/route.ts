// src/app/api/papers/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs"; // allow fs in prod

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
  const clean = text.replace(/^\uFEFF/, ""); // strip BOM if present
  return JSON.parse(clean) as T;
}

export async function GET(req: Request) {
  try {
    const file = path.join(process.cwd(), "public", "data", "papers.json");
    const raw = await fs.readFile(file, "utf-8");
    let all = safeJSONParse<Paper[]>(raw);

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase();
    const topic = (searchParams.get("topic") || "").toLowerCase();
    const sort = (searchParams.get("sort") || "year").toLowerCase(); // year|newest|title
    const order = (searchParams.get("order") || "desc").toLowerCase(); // asc|desc
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.max(
      1,
      Math.min(100, Number(searchParams.get("limit") || "10"))
    );

    if (q) {
      all = all.filter((p) => {
        const hay = [
          p.title ?? "",
          p.abstract ?? "",
          p.patient_summary ?? "",
          (p.authors ?? []).join(" "),
          p.journal ?? "",
          (p.keywords ?? []).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    if (topic) {
      all = all.filter((p) =>
        (p.keywords ?? []).some((k) => k.toLowerCase().includes(topic))
      );
    }

    // sorting
    const by = (v: string | number | undefined | null) => v ?? "";
    if (sort === "newest") {
      all.sort(
        (a, b) =>
          new Date(String(by(b.date))).getTime() -
          new Date(String(by(a.date))).getTime()
      );
    } else if (sort === "title") {
      all.sort((a, b) =>
        String(by(a.title)).localeCompare(String(by(b.title)))
      );
      if (order === "desc") all.reverse();
    } else {
      // year default
      all.sort((a, b) => Number(by(b.year)) - Number(by(a.year)));
      if (order === "asc") all.reverse();
    }

    const start = (page - 1) * limit;
    const results = all.slice(start, start + limit);

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    let message = "Unknown server error";
    if (
      typeof err === "object" &&
      err &&
      "code" in err &&
      (err as { code?: string }).code === "ENOENT"
    ) {
      message = "Missing file public/data/papers.json";
    } else if (err instanceof SyntaxError) {
      message = "Invalid JSON in public/data/papers.json";
    } else if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
