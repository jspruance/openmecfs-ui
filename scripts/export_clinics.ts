// scripts/export_clinics.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // read-only in this script, but we use service for simplicity

async function main() {
  const sb = createClient(url, key);
  const { data, error } = await sb.from("clinics").select("*").order("name");
  if (error) throw error;
  writeFileSync("data/clinics.export.json", JSON.stringify(data, null, 2));
  console.log(
    `Exported ${data?.length ?? 0} clinics → data/clinics.export.json`
  );
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
