import { NextResponse } from "next/server";
import { Resend } from "resend";
// Optional: persist to Supabase if you made a table
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot: bots fill hidden fields
    if (body?.website_hp) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const {
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

    if (!clinic?.trim() || !country?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Clinic name and country are required." },
        { status: 400 }
      );
    }

    // Optional: write to Supabase suggestions table
    // const supabase = createRouteHandlerClient({ cookies });
    // await supabase.from("clinics_suggestions").insert([{
    //   clinic, country, state, city, address_line1, address_line2, postal_code,
    //   website, booking_url, phone, email, focuses, notes,
    //   your_name, your_email
    // }]);

    const FROM = process.env.CONTACT_FROM!; // e.g., notifications@openmecfs.org (verified in Resend)
    const TO = process.env.CONTACT_TO!; // e.g., jon@openmecfs.org

    const lines = [
      `<strong>Clinic:</strong> ${escape(clinic)}`,
      `<strong>Country:</strong> ${escape(country)}`,
      state ? `<strong>State/Region:</strong> ${escape(state)}` : "",
      city ? `<strong>City:</strong> ${escape(city)}` : "",
      postal_code ? `<strong>Postal code:</strong> ${escape(postal_code)}` : "",
      address_line1
        ? `<strong>Address 1:</strong> ${escape(address_line1)}`
        : "",
      address_line2
        ? `<strong>Address 2:</strong> ${escape(address_line2)}`
        : "",
      website ? `<strong>Website:</strong> ${escape(website)}` : "",
      booking_url ? `<strong>Booking URL:</strong> ${escape(booking_url)}` : "",
      phone ? `<strong>Phone:</strong> ${escape(phone)}` : "",
      email ? `<strong>Clinic email:</strong> ${escape(email)}` : "",
      focuses ? `<strong>Focuses:</strong> ${escape(focuses)}` : "",
      notes
        ? `<strong>Notes:</strong><br/><pre style="white-space:pre-wrap;background:#f6f7f9;padding:10px;border-radius:8px;border:1px solid #e5e7eb;">${escape(
            notes
          )}</pre>`
        : "",
      your_name || your_email
        ? `<hr/><strong>Submitted by:</strong> ${escape(
            your_name || "(anon)"
          )}, ${escape(your_email || "(no email)")}`
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
      from: FROM,
      to: TO,
      subject: `[Open ME/CFS] Clinic Suggestion — ${clinic}`,
      reply_to: your_email || undefined,
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

// super light HTML escaping
function escape(s: string) {
  return String(s).replace(
    /[<>&"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]!)
  );
}
