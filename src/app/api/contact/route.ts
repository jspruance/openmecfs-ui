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
      turnstile = "",
    } = body ?? {};

    // 🧱 Honeypot check
    if (website?.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 🧠 Basic validation
    if (!email || !message) {
      return NextResponse.json(
        { ok: false, error: "Email and message are required." },
        { status: 400 }
      );
    }

    // 🧩 Verify Cloudflare Turnstile
    if (!turnstile) {
      return NextResponse.json(
        { ok: false, error: "Captcha token missing." },
        { status: 400 }
      );
    }

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY!,
          response: turnstile,
        }),
      }
    );

    const verification = await verifyRes.json();

    if (!verification.success) {
      console.error("Turnstile verification failed:", verification);
      return NextResponse.json(
        { ok: false, error: "Captcha verification failed." },
        { status: 400 }
      );
    }

    const FROM = process.env.CONTACT_FROM!;
    const TO = process.env.CONTACT_TO!;

    // 📨 1) Notify admin
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
      reply_to: email,
      subject: subject?.trim()
        ? `[Open ME/CFS] ${subject}`
        : "[Open ME/CFS] New Contact",
      html,
    });

    // 🪶 2) Courtesy auto-reply
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
