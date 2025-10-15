// components/NewsletterForm.tsx
"use client";
import { useState } from "react";

type Props = {
  source?: string;
  variant?: "pill" | "default";
};

export default function NewsletterForm({
  source = "footer",
  variant = "pill",
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(fd.get("email") || "").trim(),
        consent: fd.get("consent") === "on",
        source,
        hp: String(fd.get("website") || ""), // honeypot
      }),
    });

    const json = await res.json();
    setStatus(json.ok ? "ok" : "err");
    setMsg(
      json.ok
        ? "Thanks—you're subscribed!"
        : json.error || "Something went wrong"
    );
    if (json.ok) (e.target as HTMLFormElement).reset();
  }

  const pill = variant === "pill";

  return (
    <form
      onSubmit={onSubmit}
      className={
        pill
          ? "space-y-3"
          : "grid gap-3 md:grid-cols-[1fr_auto] md:items-center"
      }
    >
      {/* Email + Button row */}
      <div
        className={
          pill
            ? "flex items-center rounded-full border border-neutral-300 bg-white p-1 shadow-sm"
            : "contents"
        }
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          aria-label="Email address"
          className={
            "h-12 w-full bg-white text-neutral-900 placeholder:text-neutral-400 " +
            (pill
              ? "rounded-full px-4 focus:outline-none"
              : "rounded-xl border border-neutral-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500")
          }
        />
        <button
          disabled={status === "loading"}
          className={
            "cursor-pointer font-semibold text-white transition " +
            (pill
              ? "ml-2 h-12 rounded-full px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg"
              : "h-12 rounded-xl px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg")
          }
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      {/* Consent + honeypot */}
      <label
        className={
          (pill ? "px-2 " : "") +
          "flex items-start gap-2 text-sm text-neutral-700"
        }
      >
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>I agree to receive emails and accept the Privacy Policy.</span>
      </label>
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Status message */}
      {msg && (
        <p
          className={
            (pill ? "px-2 " : "md:col-span-2 ") +
            (status === "ok" ? "text-green-600" : "text-red-600") +
            " text-sm"
          }
          role="status"
          aria-live="polite"
        >
          {msg}
        </p>
      )}
    </form>
  );
}
