// scripts/seed_clinics.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Stable key for upserts/links
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Minimal, accurate-enough starters; addresses kept blank for now
const baseRows = [
  {
    name: "INIM (Dr. Nancy Klimas)",
    country: "USA",
    state: "FL",
    city: "Davie",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    website: "https://www.nova.edu/nim",
    booking_url: "",
    email: "",
    phone: "",
    tags: ["ME/CFS", "Long COVID", "Immunology"],
    autonomic_focused: false,
    notes:
      "Institute for Neuro-Immune Medicine at Nova Southeastern University.",
  },
  {
    name: "Stanford (ME/CFS Program)",
    country: "USA",
    state: "CA",
    city: "Stanford",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    website: "https://med.stanford.edu/",
    booking_url: "",
    email: "",
    phone: "",
    tags: ["ME/CFS", "Research"],
    autonomic_focused: false,
    notes: "Academic program; availability varies.",
  },
  {
    name: "Bateman Horne Center",
    country: "USA",
    state: "UT",
    city: "Salt Lake City",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    website: "https://batemanhornecenter.org",
    booking_url: "",
    email: "",
    phone: "",
    tags: ["ME/CFS", "OI/POTS", "Long COVID"],
    autonomic_focused: true,
    notes: "",
  },
  {
    name: "Charité — Fatigue Center",
    country: "Germany",
    state: "BE",
    city: "Berlin",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    website: "https://www.charite.de",
    booking_url: "",
    email: "",
    phone: "",
    tags: ["ME/CFS", "Autonomic", "Research"],
    autonomic_focused: true,
    notes: "Large academic center; demand is high.",
  },
  {
    name: "Center for Complex Diseases (Dr. David Kaufman)",
    country: "USA",
    state: "CA",
    city: "Mountain View",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    website: "https://www.complexdx.com",
    booking_url: "",
    email: "",
    phone: "",
    tags: ["ME/CFS", "OI/POTS"],
    autonomic_focused: true,
    notes: "",
  },
];

// Add `slug` per row
const rows = baseRows.map((c) => ({
  ...c,
  slug: toSlug([c.name, c.city, c.state, c.country].filter(Boolean).join("-")),
}));

async function main() {
  // Upsert on slug (requires UNIQUE index on clinics.slug)
  const { data, error } = await supabase
    .from("clinics")
    .upsert(rows, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
  console.log("Seeded clinics:", data?.length ?? 0);
}

main();
