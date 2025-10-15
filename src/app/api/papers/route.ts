// src/app/api/papers/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs"; // ensure fs is allowed

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
  date?: string; // ISO string
};

function safeJSONParse<T>(text: string): T {
  // strips BOM if present; throws with clearer message if invalid
  const clean = text.replace(/^\uFEFF/, "");
  try {
    return JSON.parse(clean) as T;
  } catch (e) {
    throw new Error("Invalid JSON in public/data/papers.json");
  }
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

    // sort
    const by = (v: string | number | undefined | null) => v ?? "";
    if (sort === "newest") {
      all.sort(
        (a, b) =>
          new Date(by(b.date) as string).getTime() -
          new Date(by(a.date) as string).getTime()
      );
    } else if (sort === "title") {
      all.sort((a, b) =>
        String(by(a.title)).localeCompare(String(by(b.title)))
      );
      if (order === "desc") all.reverse();
    } else {
      // year
      all.sort(
        (a, b) =>
          (Number(by(b.year)) as number) - (Number(by(a.year)) as number)
      );
      if (order === "asc") all.reverse();
    }

    const start = (page - 1) * limit;
    const results = all.slice(start, start + limit);

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    // Helpful diagnostics during dev
    const message =
      err?.code === "ENOENT"
        ? "Missing file public/data/papers.json"
        : err?.message || "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
