// app/api/clinics/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
  try {
    const supabase = createClient(url, anon);
    const { searchParams } = new URL(req.url);

    const featured = searchParams.get("featured");
    const country = searchParams.get("country") || undefined;

    let q = supabase.from("clinics").select("*");

    if (featured === "1" || featured === "true") {
      // curated page: rank first, then name
      q = q
        .eq("featured", true)
        .order("featured_rank", { ascending: true, nullsFirst: false })
        .order("name", { ascending: true });
    } else {
      // directory default: name A–Z
      q = q.order("name", { ascending: true });
    }

    if (country) q = q.eq("country", country);

    const { data, error } = await q;
    if (error) throw error;

    return NextResponse.json({ ok: true, clinics: data });
  } catch (e: any) {
    console.error("CLINICS_LIST_ERROR", e);
    return NextResponse.json(
      { ok: false, error: e.message || "Failed" },
      { status: 500 }
    );
  }
}
