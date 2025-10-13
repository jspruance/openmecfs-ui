import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

function reqNotConfigured() {
  return !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY;
}

function getClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

/* ------------------------------- POST (UPSERT) ------------------------------- */
export async function POST(req: Request) {
  try {
    if (reqNotConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Server not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { adminPass, originalSlug, tags, ...clinic } = body ?? {};

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

    // Normalize tags to array<string>
    const tagsArr: string[] = Array.isArray(tags)
      ? (tags as string[]).map((t) => String(t).trim()).filter(Boolean)
      : String(tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

    // Build slug from current values
    const slugParts = [
      String(clinic.name || "").trim(),
      String(clinic.city || "").trim(),
      String(clinic.state || "").trim(),
      String(clinic.country || "").trim(),
    ].filter(Boolean);
    const newSlug = slugify(slugParts.join("-"));

    const supabase = getClient();

    const payload = {
      slug: newSlug,
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
      website: clinic.website ? String(clinic.website).trim() : null,
      booking_url: clinic.booking_url
        ? String(clinic.booking_url).trim()
        : null,
      email: clinic.email ? String(clinic.email).trim() : null,
      phone: clinic.phone ? String(clinic.phone).trim() : null,
      tags: tagsArr,
      autonomic_focused: !!clinic.autonomic_focused,
      notes: clinic.notes ? String(clinic.notes).trim() : null,
    };

    let data, error;

    if (originalSlug) {
      // Edit an existing record, matching the one the admin clicked
      ({ data, error } = await supabase
        .from("clinics")
        .update(payload)
        .eq("slug", String(originalSlug))
        .select()
        .single());
    } else {
      // Create new record; require a unique slug index on clinics.slug
      ({ data, error } = await supabase
        .from("clinics")
        .upsert(payload, { onConflict: "slug" })
        .select()
        .single());
    }

    if (error) {
      console.error("ADMIN_UPSERT_ERROR", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, clinic: data });
  } catch (e: any) {
    console.error("ADMIN_UPSERT_ERROR", e);
    return NextResponse.json(
      { ok: false, error: "Unexpected error." },
      { status: 500 }
    );
  }
}

/* ------------------------------- DELETE (BY SLUG) ------------------------------- */
export async function DELETE(req: Request) {
  try {
    if (reqNotConfigured()) {
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

    const supabase = getClient();
    const { error } = await supabase
      .from("clinics")
      .delete()
      .eq("slug", String(slug));

    if (error) {
      console.error("ADMIN_DELETE_ERROR", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("ADMIN_DELETE_ERROR", e);
    return NextResponse.json(
      { ok: false, error: "Unexpected error." },
      { status: 500 }
    );
  }
}
