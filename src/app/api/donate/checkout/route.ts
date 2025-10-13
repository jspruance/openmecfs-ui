import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // incoming from client
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

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/donate/cancel`;

    const commonLineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
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
      line_items: [commonLineItem],
      success_url: successUrl,
      cancel_url: cancelUrl,
      // nicer button copy for one-time mode:
      ...(recurrence === "one_time" ? { submit_type: "donate" } : {}),
      // collect an email if donor didn't enter one:
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
  } catch (err: any) {
    console.error("STRIPE_CHECKOUT_ERROR", err?.message || err);
    return NextResponse.json(
      { error: "Failed to create checkout." },
      { status: 500 }
    );
  }
}
