"use client";

import { useState } from "react";
import { Mail, User, MessageSquare } from "lucide-react";
import Turnstile from "react-turnstile"; // ✅ correct for this package

export default function ContactSection() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, turnstile: token }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to send");
      setState("success");
      form.reset();
      setToken(""); // reset captcha
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <section id="contact" className="relative py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Have a question, want to collaborate, or interested in supporting
            the project? Send us a message — we’d love to hear from you.
          </p>
          <ul className="mt-6 space-y-2 text-gray-600">
            <li>📧 contact@openmecfs.org</li>
            <li>❤️ We read every message.</li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm grid gap-4"
        >
          {/* Honeypot (hidden from humans) */}
          <input
            type="text"
            name="website"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Name</span>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                name="name"
                placeholder="Your name"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-brand focus:outline-none"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Email *</span>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-brand focus:outline-none"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Subject</span>
            <input
              name="subject"
              placeholder="How can we help?"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-brand focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Message *</span>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="message"
                required
                rows={6}
                placeholder="Write your message…"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-brand focus:outline-none"
              />
            </div>
          </label>

          {/* ✅ Cloudflare Turnstile (react-turnstile) */}
          <div className="flex justify-center my-2">
            <Turnstile
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} // lowercase "sitekey" is required here
              onVerify={(token) => setToken(token)} // this prop name is also different
              theme="light"
            />
          </div>

          <button
            type="submit"
            disabled={state === "loading" || !token}
            className="
    cursor-pointer inline-flex items-center justify-center 
    px-6 py-3 rounded-md font-semibold 
    bg-blue-600 text-white 
    hover:bg-blue-700 hover:shadow-md 
    transition disabled:opacity-60 disabled:cursor-not-allowed
  "
          >
            {state === "loading" ? "Sending…" : "Send Message"}
          </button>

          {state === "success" && (
            <p className="text-green-700 text-sm">
              Thanks! Your message has been sent.
            </p>
          )}
          {state === "error" && (
            <p className="text-red-600 text-sm">Oops — {error}</p>
          )}
        </form>
      </div>
    </section>
  );
}
