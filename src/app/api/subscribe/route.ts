import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const valid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export async function POST(req: Request) {
  try {
    const { email, consent, source, hp } = await req.json();
    if (hp) return NextResponse.json({ ok: true }); // honeypot
    if (!email || !valid(email))
      return NextResponse.json(
        { ok: false, error: "Valid email required" },
        { status: 400 }
      );
    if (!consent)
      return NextResponse.json(
        { ok: false, error: "Consent required" },
        { status: 400 }
      );

    const ip = req.headers.get("x-forwarded-for") ?? "";
    const ua = req.headers.get("user-agent") ?? "";

    const { error } = await supabaseAdmin.from("newsletter_subscribers").upsert(
      {
        email: email.trim().toLowerCase(),
        status: "subscribed",
        consent: true,
        consent_at: new Date().toISOString(),
        source: source ?? "site",
        ip,
        ua,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email", ignoreDuplicates: false }
    );

    if (error)
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
