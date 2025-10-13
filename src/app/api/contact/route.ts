// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name = "",
      email = "",
      subject = "",
      message = "",
      website = "",
    } = body ?? {};

    // Honeypot: if filled, it's a bot
    if (website?.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Basic validation
    if (!email || !message) {
      return NextResponse.json(
        { ok: false, error: "Email and message are required." },
        { status: 400 }
      );
    }

    const FROM = process.env.CONTACT_FROM!;
    const TO = process.env.CONTACT_TO!;

    // 1) Send to you (notification)
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;">
        <h2 style="margin:0 0 8px;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name || "(not provided)"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "(none)"} </p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;background:#f6f7f9;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">${message}</pre>
        <p style="color:#6b7280;font-size:12px;margin-top:16px;">Sent via openmecfs.org contact form</p>
      </div>
    `;

    await resend.emails.send({
      from: FROM,
      to: TO,
      reply_to: email, // lets you reply straight to the sender
      subject: subject?.trim()
        ? `[Open ME/CFS] ${subject}`
        : "[Open ME/CFS] New Contact",
      html,
    });

    // 2) Courtesy auto-reply to sender (optional but nice)
    const confirmHtml = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;">
        <p>Hi${name ? ` ${name}` : ""},</p>
        <p>Thanks for contacting <strong>Open ME/CFS</strong>. We received your message and will get back to you soon.</p>
        <p style="margin:0 0 6px;"><strong>Your message:</strong></p>
        <blockquote style="margin:0;border-left:3px solid #e5e7eb;padding-left:12px;color:#374151;">
          ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
        </blockquote>
        <p style="color:#6b7280;font-size:12px;margin-top:16px;">If you didn’t submit this, you can ignore this email.</p>
      </div>
    `;

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "We received your message — Open ME/CFS",
      html: confirmHtml,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CONTACT_FORM_ERROR", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected error." },
      { status: 500 }
    );
  }
}
