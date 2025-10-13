import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Basic filter support: ?q=&country=&state=&onlyAutonomic=true
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const country = searchParams.get("country") || "";
  const state = searchParams.get("state") || "";
  const onlyAutonomic = searchParams.get("onlyAutonomic") === "true";

  let query = supabaseAdmin
    .from("clinics")
    .select("*")
    .order("name", { ascending: true });

  if (country) query = query.eq("country", country);
  if (state) query = query.eq("state", state);
  if (onlyAutonomic) query = query.eq("autonomic_focused", true);

  const { data, error } = await query;
  if (error) {
    console.error("clinics list error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to load clinics" },
      { status: 500 }
    );
  }

  const filtered = q
    ? data.filter((c) => {
        const hay = [
          c.name,
          c.city || "",
          c.state || "",
          c.country || "",
          (c.tags || []).join(" "),
          c.notes || "",
        ]
          .join(" • ")
          .toLowerCase();
        return hay.includes(q);
      })
    : data;

  return NextResponse.json({ ok: true, clinics: filtered });
}
