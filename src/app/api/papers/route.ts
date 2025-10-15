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

function toLower(s: string | undefined | null): string {
  return String(s ?? "").toLowerCase();
}

function parseYearRange(value: string) {
  // Accept "2023" or "2020-2024"
  const m = value.match(/^(\d{4})(?:-(\d{4}))?$/);
  if (!m) return null;
  const y1 = Number(m[1]);
  const y2 = m[2] ? Number(m[2]) : y1;
  return y1 <= y2 ? { y1, y2 } : { y1: y2, y2: y1 };
}

export async function GET(req: Request) {
  try {
    const file = path.join(process.cwd(), "public", "data", "papers.json");
    const raw = await fs.readFile(file, "utf-8");
    let all = safeJSONParse<Paper[]>(raw);

    const { searchParams } = new URL(req.url);
    const q = toLower(searchParams.get("q"));
    const topic = toLower(searchParams.get("topic"));
    const author = toLower(searchParams.get("author"));
    const journal = toLower(searchParams.get("journal"));
    const yearParam = searchParams.get("year") || "";
    const sort = toLower(searchParams.get("sort") || "year"); // year|newest|title
    const order = toLower(searchParams.get("order") || "desc"); // asc|desc
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.max(
      1,
      Math.min(100, Number(searchParams.get("limit") || "10"))
    );

    // Full-text-ish search
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

    // Topic via keywords (substring match)
    if (topic) {
      all = all.filter((p) =>
        (p.keywords ?? []).some((k) => toLower(k).includes(topic))
      );
    }

    // Author substring (join authors array)
    if (author) {
      all = all.filter((p) =>
        (p.authors ?? []).join(" ").toLowerCase().includes(author)
      );
    }

    // Journal substring
    if (journal) {
      all = all.filter((p) => toLower(p.journal).includes(journal));
    }

    // Year exact or range
    if (yearParam) {
      const yr = parseYearRange(yearParam);
      if (yr) {
        const { y1, y2 } = yr;
        all = all.filter(
          (p) => typeof p.year === "number" && p.year! >= y1 && p.year! <= y2
        );
      }
    }

    // Sorting
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
      // default: year
      all.sort((a, b) => Number(by(b.year)) - Number(by(a.year)));
      if (order === "asc") all.reverse();
    }

    // Pagination
    const start = (page - 1) * limit;
    const results = all.slice(start, start + limit);

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    // Build a helpful message without using `any`
    let message = "Unknown server error";
    const maybeError = err as { code?: unknown; message?: unknown };

    if (
      maybeError &&
      typeof maybeError.code === "string" &&
      maybeError.code === "ENOENT"
    ) {
      message = "Missing file public/data/papers.json";
    } else if (err instanceof SyntaxError) {
      message = "Invalid JSON in public/data/papers.json";
    } else if (maybeError && typeof maybeError.message === "string") {
      message = maybeError.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
