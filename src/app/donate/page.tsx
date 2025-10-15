"use client";

import { useState } from "react";

const PRESETS = [10, 25, 50, 100];

const handleDonateClick = () => {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).umami?.track?.("donate_donate_page_click");
  }
};

export default function DonatePage() {
  const [recurrence, setRecurrence] = useState<"one_time" | "monthly">(
    "one_time"
  );
  const [amount, setAmount] = useState<number>(25);
  const [custom, setCustom] = useState<string>("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const liveAmount = custom ? Number(custom) : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const amt = Number(liveAmount);
    if (!amt || isNaN(amt) || amt < 1) {
      setErr("Please enter a valid amount (minimum $1).");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          recurrence,
          donorName,
          donorEmail,
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to start checkout.");
      window.location.href = data.url;
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Support Open ME/CFS
        </h1>
        <p className="mt-2 text-gray-600">
          Your donation funds open research, patient and provider education, and
          tooling for the ME/CFS community.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Recurrence */}
          <div className="flex gap-3">
            {[
              { key: "one_time", label: "One-time" },
              { key: "monthly", label: "Monthly" },
            ].map((r) => (
              <button
                type="button"
                key={r.key}
                onClick={() => setRecurrence(r.key as "one_time" | "monthly")}
                className={
                  "px-4 py-2 rounded-md border transition cursor-pointer " +
                  (recurrence === r.key
                    ? "border-brand bg-blue-50 text-brand"
                    : "border-gray-200 hover:bg-gray-50 text-gray-700")
                }
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Amounts */}
          <div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setCustom("");
                    setAmount(v);
                  }}
                  className={
                    "px-4 py-2 rounded-md border transition cursor-pointer " +
                    (!custom && amount === v
                      ? "border-brand bg-blue-50 text-brand"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700")
                  }
                >
                  ${v}
                </button>
              ))}

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                  $
                </span>
                <input
                  type="number"
                  min={1}
                  placeholder="Custom"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="pl-7 pr-3 py-2 w-32 rounded-md border border-gray-200 focus:border-brand focus:ring-brand"
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Selected amount: <strong>${liveAmount || 0}</strong>{" "}
              {recurrence === "monthly" ? "per month" : ""}
            </p>
          </div>

          {/* Donor info (optional) */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
            />
            <input
              type="email"
              placeholder="Email for receipt (optional)"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand"
            />
          </div>

          <textarea
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 focus:border-brand focus:ring-brand min-h-[90px]"
          />

          {err && <p className="text-red-600 text-sm">{err}</p>}

          <button
            type="submit"
            onClick={handleDonateClick}
            disabled={loading}
            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold
                       bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-blue-900
                       shadow-[0_0_20px_rgba(255,200,100,0.6)]
                       hover:shadow-[0_0_40px_rgba(255,200,100,0.8)] hover:scale-[1.02] active:scale-[0.98]
                       transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {loading
              ? "Redirecting…"
              : recurrence === "monthly"
              ? "Donate Monthly"
              : "Donate"}
          </button>

          <p className="text-xs text-gray-500">
            Payments are processed securely by Stripe. Apple Pay and Google Pay
            supported.
          </p>

          {/* ➕ Disclosure (no %s, no named orgs) */}
          <p className="text-[11px] leading-relaxed text-gray-500">
            Open ME/CFS is not a tax-exempt charity; contributions are{" "}
            <strong>not tax-deductible</strong>. Donations support platform
            operations and may be granted to independent ME/CFS research and
            advocacy efforts. We publish periodic summaries of income, expenses,
            and grants.
          </p>
        </form>
      </section>
    </main>
  );
}
