// app/api/clinics/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    // Get environment variables
    const url = process.env.SUPABASE_URL;
    const anon = process.env.SUPABASE_ANON_KEY;

    // Validate environment variables
    if (!url || !anon) {
      const missing = [];
      if (!url) missing.push("SUPABASE_URL");
      if (!anon) missing.push("SUPABASE_ANON_KEY");
      console.error("CLINICS_LIST_ERROR: Missing Supabase credentials:", missing.join(", "));
      return NextResponse.json(
        { 
          ok: false, 
          error: `Server configuration error: Missing ${missing.join(" and ")}` 
        },
        { status: 500 }
      );
    }

    console.log("[ClinicAPI] Initializing Supabase client...");
    // Ensure we're using the correct Supabase client configuration
    // If legacy keys are disabled, make sure SUPABASE_ANON_KEY is a valid project API key
    const supabase = createClient(url, anon, {
      auth: {
        persistSession: false,
      },
    });
    
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const country = searchParams.get("country") || undefined;

    console.log("[ClinicAPI] Query params:", { featured, country });

    let q = supabase.from("clinics").select("*");

    if (featured === "1" || featured === "true") {
      // curated page: rank first, then name
      console.log("[ClinicAPI] Fetching featured clinics");
      q = q
        .eq("featured", true)
        .order("featured_rank", { ascending: true, nullsFirst: false })
        .order("name", { ascending: true });
    } else {
      // directory default: name A–Z
      console.log("[ClinicAPI] Fetching all clinics");
      q = q.order("name", { ascending: true });
    }

    if (country) {
      console.log("[ClinicAPI] Filtering by country:", country);
      q = q.eq("country", country);
    }

    console.log("[ClinicAPI] Executing query...");
    const { data, error } = await q;
    
    if (error) {
      console.error("CLINICS_LIST_ERROR - Supabase query failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json(
        { 
          ok: false, 
          error: `Database error: ${error.message}` 
        },
        { status: 500 }
      );
    }

    // Ensure we always return an array
    const clinics = Array.isArray(data) ? data : [];
    console.log("[ClinicAPI] Query successful, returning", clinics.length, "clinics");

    return NextResponse.json({ ok: true, clinics });
  } catch (e: unknown) {
    console.error("CLINICS_LIST_ERROR - Unexpected error:", e);
    const errorMessage = e instanceof Error ? e.message : "Failed to load clinics";
    const errorStack = e instanceof Error ? e.stack : undefined;
    
    if (errorStack) {
      console.error("CLINICS_LIST_ERROR - Stack trace:", errorStack);
    }
    
    return NextResponse.json(
      { 
        ok: false, 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
