// app/api/clinics/admin-upsert/route.ts
import { NextResponse } from "next/server";
import { createClient, PostgrestError } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ADMIN_PASS = process.env.OPENMECFS_ADMIN_PASSWORD!;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
const isConfigured = () => !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
const sb = () => createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const cleanUrl = (v?: string | null) => {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  try {
    // add protocol if missing
    const withProto = /^https?:\/\//i.test(s) ? s : `https://${s}`;
    new URL(withProto);
    return withProto;
  } catch {
    return null; // drop invalid urls
  }
};

function toTagsArray(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags
      .map(String)
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return String(tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/* ------------------------------- POST (UPSERT) ------------------------------- */
export async function POST(req: Request) {
  try {
    if (!isConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Server not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { adminPass, originalSlug, tags, featured, ...clinic } = body ?? {};

    if (!ADMIN_PASS || adminPass !== ADMIN_PASS) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    if (!clinic?.name || !clinic?.country) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: name, country." },
        { status: 400 }
      );
    }

    const tagsArr = toTagsArray(tags);

    // Build a candidate slug for *new* records only.
    const candidateSlug = slugify(
      [clinic.name, clinic.city, clinic.state, clinic.country]
        .map((x) => String(x ?? "").trim())
        .filter(Boolean)
        .join("-")
    );

    const supabase = sb();

    // Normalize payload
    const payload = {
      // Slug rules:
      // - If editing (originalSlug provided) -> keep the existing slug stable.
      // - If creating -> use computed candidateSlug.
      slug: originalSlug ? String(originalSlug) : candidateSlug,
      name: String(clinic.name).trim(),
      country: String(clinic.country).trim(),
      state: clinic.state ? String(clinic.state).trim() : null,
      city: clinic.city ? String(clinic.city).trim() : null,
      postal_code: clinic.postal_code
        ? String(clinic.postal_code).trim()
        : null,
      address_line1: clinic.address_line1
        ? String(clinic.address_line1).trim()
        : null,
      address_line2: clinic.address_line2
        ? String(clinic.address_line2).trim()
        : null,
      website: cleanUrl(clinic.website),
      booking_url: cleanUrl(clinic.booking_url),
      email: clinic.email ? String(clinic.email).trim() : null,
      phone: clinic.phone ? String(clinic.phone).trim() : null,
      tags: tagsArr,
      autonomic_focused: !!clinic.autonomic_focused,
      notes: clinic.notes ? String(clinic.notes).trim() : null,
      featured: !!featured,
    };

    let data, error: PostgrestError | null;

    if (originalSlug) {
      // Update existing by originalSlug (stable)
      ({ data, error } = await supabase
        .from("clinics")
        .update(payload)
        .eq("slug", String(originalSlug))
        .select()
        .single());
    } else {
      // Create new; rely on unique index on clinics.slug
      ({ data, error } = await supabase
        .from("clinics")
        .upsert(payload, { onConflict: "slug" })
        .select()
        .single());
    }

    if (error) {
      // unique violation code from PostgREST/PG
      const isUnique =
        error.code === "23505" ||
        /duplicate key value violates unique constraint/i.test(error.message);
      return NextResponse.json(
        { ok: false, error: isUnique ? "Slug already exists." : error.message },
        { status: isUnique ? 409 : 500 }
      );
    }

    return NextResponse.json({ ok: true, clinic: data });
  } catch (e: unknown) {
    console.error("ADMIN_UPSERT_ERROR", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unexpected error." },
      { status: 500 }
    );
  }
}

/* ------------------------------- DELETE (BY SLUG) ------------------------------- */
export async function DELETE(req: Request) {
  try {
    if (!isConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Server not configured." },
        { status: 500 }
      );
    }

    const { adminPass, slug } = await req.json();

    if (!ADMIN_PASS || adminPass !== ADMIN_PASS) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized." },
        { status: 401 }
      );
    }
    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Missing slug to delete." },
        { status: 400 }
      );
    }

    const { error } = await sb()
      .from("clinics")
      .delete()
      .eq("slug", String(slug));
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("ADMIN_DELETE_ERROR", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unexpected error." },
      { status: 500 }
    );
  }
}
