import { NextResponse } from "next/server";
import { Resend } from "resend";
// Optional: persist to Supabase if you made a table
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

/** super light HTML escaping */
function escapeHtml(s: string) {
  return String(s).replace(
    /[<>&"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]!)
  );
}

/** normalize a URL-ish string (adds https:// if missing) */
function normalizeUrl(u: string) {
  const s = (u || "").trim();
  if (!s) return "";
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot: bots fill hidden fields
    if (body?.website_hp) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    let {
      clinic = "",
      country = "",
      state = "",
      city = "",
      address_line1 = "",
      address_line2 = "",
      postal_code = "",
      website = "",
      booking_url = "",
      phone = "",
      email = "",
      focuses = "",
      notes = "",
      your_name = "",
      your_email = "",
    } = body || {};

    // Trim core fields
    clinic = String(clinic).trim();
    country = String(country).trim();
    state = String(state || "");
    city = String(city || "");
    address_line1 = String(address_line1 || "");
    address_line2 = String(address_line2 || "");
    postal_code = String(postal_code || "");
    phone = String(phone || "");
    email = String(email || "");
    focuses = String(focuses || "");
    notes = String(notes || "");
    your_name = String(your_name || "");
    your_email = String(your_email || "");
    website = normalizeUrl(String(website || ""));
    booking_url = normalizeUrl(String(booking_url || ""));

    if (!clinic || !country) {
      return NextResponse.json(
        { ok: false, error: "Clinic name and country are required." },
        { status: 400 }
      );
    }

    const FROM = process.env.CONTACT_FROM || "";
    const TO = process.env.CONTACT_TO || "";

    if (!FROM || !TO) {
      return NextResponse.json(
        {
          ok: false,
          error: "Email routing not configured (CONTACT_FROM / CONTACT_TO).",
        },
        { status: 500 }
      );
    }

    const lines = [
      `<strong>Clinic:</strong> ${escapeHtml(clinic)}`,
      `<strong>Country:</strong> ${escapeHtml(country)}`,
      state ? `<strong>State/Region:</strong> ${escapeHtml(state)}` : "",
      city ? `<strong>City:</strong> ${escapeHtml(city)}` : "",
      postal_code
        ? `<strong>Postal code:</strong> ${escapeHtml(postal_code)}`
        : "",
      address_line1
        ? `<strong>Address 1:</strong> ${escapeHtml(address_line1)}`
        : "",
      address_line2
        ? `<strong>Address 2:</strong> ${escapeHtml(address_line2)}`
        : "",
      website ? `<strong>Website:</strong> ${escapeHtml(website)}` : "",
      booking_url
        ? `<strong>Booking URL:</strong> ${escapeHtml(booking_url)}`
        : "",
      phone ? `<strong>Phone:</strong> ${escapeHtml(phone)}` : "",
      email ? `<strong>Clinic email:</strong> ${escapeHtml(email)}` : "",
      focuses ? `<strong>Focuses:</strong> ${escapeHtml(focuses)}` : "",
      notes
        ? `<strong>Notes:</strong><br/><pre style="white-space:pre-wrap;background:#f6f7f9;padding:10px;border-radius:8px;border:1px solid #e5e7eb;">${escapeHtml(
            notes
          )}</pre>`
        : "",
      your_name || your_email
        ? `<hr/><strong>Submitted by:</strong> ${escapeHtml(
            your_name || "(anon)"
          )}, ${escapeHtml(your_email || "(no email)")}`
        : "",
    ]
      .filter(Boolean)
      .join("<br/>");

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;">
        <h2 style="margin:0 0 8px;">New Clinic Suggestion</h2>
        ${lines}
        <p style="color:#6b7280;font-size:12px;margin-top:16px;">Sent via openmecfs.org — Clinic Suggest</p>
      </div>
    `;

    await resend.emails.send({
      from: FROM, // e.g. 'Open ME/CFS <hello@openmecfs.org>'
      to: TO, // your inbox
      subject: `[Open ME/CFS] Clinic Suggestion — ${clinic}`,
      replyTo: your_email || undefined, // ✅ camelCase
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("CLINIC_SUGGEST_ERROR", e);
    return NextResponse.json(
      { ok: false, error: "Unexpected error." },
      { status: 500 }
    );
  }
}
