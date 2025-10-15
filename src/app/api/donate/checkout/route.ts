// app/api/donate/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Let Stripe use your Dashboard's default API version.
// If you really want to pin it in code, use the newest version string:
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-09-30.clover" as any });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      amount, // number in dollars (e.g., 25)
      recurrence, // "one_time" | "monthly"
      donorName = "",
      donorEmail = "",
      note = "",
    } = body ?? {};

    // basic validation
    const amt = Number(amount);
    if (!amt || isNaN(amt) || amt < 1 || amt > 50000) {
      return NextResponse.json(
        { error: "Amount must be between $1 and $50,000" },
        { status: 400 }
      );
    }
    if (recurrence !== "one_time" && recurrence !== "monthly") {
      return NextResponse.json(
        { error: "Invalid recurrence" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amt * 100);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const successUrl = `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/donate/cancel`;

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: {
          name:
            recurrence === "monthly"
              ? "Monthly Donation to Open ME/CFS"
              : "Donation to Open ME/CFS",
        },
        unit_amount: amountInCents,
        ...(recurrence === "monthly"
          ? { recurring: { interval: "month" } }
          : {}),
      },
    };

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: recurrence === "monthly" ? "subscription" : "payment",
      line_items: [lineItem],
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(recurrence === "one_time" ? { submit_type: "donate" } : {}),
      customer_email: donorEmail || undefined,
      metadata: {
        donorName,
        donorEmail,
        note,
        recurrence,
        app: "openmecfs",
      },
      allow_promotion_codes: false,
    };

    const session = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    console.error(
      "STRIPE_CHECKOUT_ERROR",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      { error: "Failed to create checkout." },
      { status: 500 }
    );
  }
}
