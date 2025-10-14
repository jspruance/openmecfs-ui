// scripts/seed_clinics.ts
import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  process.exit(1);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type Row = {
  id?: string;
  slug?: string;
  name: string;
  country: string;
  state?: string | null;
  city?: string | null;
  postal_code?: string | null;

  website?: string | null;
  booking_url?: string | null;
  email?: string | null;
  phone?: string | null;

  address_line1?: string | null;
  address_line2?: string | null;

  tags?: string[];
  autonomic_focused?: boolean | null;
  notes?: string | null;

  featured?: boolean | null;
};

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1) read the edited file you exported
  const file = join(process.cwd(), "data", "clinics.export.json");
  const json = JSON.parse(readFileSync(file, "utf8")) as Row[];

  // 2) normalize + build payloads
  const payloads = json.map((r) => {
    const slug =
      r.slug ||
      slugify([r.name, r.city || "", r.state || "", r.country || ""].join("-"));

    return {
      slug,
      name: r.name,
      country: r.country,
      state: r.state ?? null,
      city: r.city ?? null,
      postal_code: r.postal_code ?? null,

      website: r.website ?? null,
      booking_url: r.booking_url ?? null,
      email: r.email ?? null,
      phone: r.phone ?? null,

      address_line1: r.address_line1 ?? null,
      address_line2: r.address_line2 ?? null,

      tags: Array.isArray(r.tags) ? r.tags : [],
      autonomic_focused: !!r.autonomic_focused,
      notes: r.notes ?? null,

      featured: !!r.featured,
    };
  });

  // 3) upsert on slug
  const { data, error } = await supabase
    .from("clinics")
    .upsert(payloads, { onConflict: "slug" })
    .select("slug,name");

  if (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }

  console.log(`Upserted ${data?.length ?? 0} clinics.`);
}

main();
