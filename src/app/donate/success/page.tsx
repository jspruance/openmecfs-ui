// app/success/page.tsx
"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-[70vh] flex items-center bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-xl mx-auto px-6 text-center">
        {/* Pink heart badge */}
        <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-rose-100 shadow-md ring-1 ring-rose-200">
          <svg
            viewBox="0 0 24 24"
            className="h-12 w-12 text-rose-500"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M11.645 20.91a1 1 0 0 0 .71 0c1.873-.71 8.645-3.946 8.645-10.16A5.25 5.25 0 0 0 12 6.11a5.25 5.25 0 0 0-9 4.64c0 6.214 6.772 9.451 8.645 10.16Z" />
          </svg>
          {/* subtle check accent */}
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow ring-1 ring-rose-200">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-rose-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-gray-900">
          Thank you for your donation!
        </h1>
        <p className="mt-2 text-gray-600">
          Your support helps accelerate ME/CFS research and bring hope to
          patients.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-gray-900 px-5 py-3 text-white shadow hover:bg-black/90 transition"
          >
            Back Home
          </Link>
          <Link
            href="/research"
            className="rounded-md border border-gray-300 px-5 py-3 text-gray-800 hover:bg-gray-50 transition"
          >
            Explore Research
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          A receipt has been emailed to you.
        </p>
      </div>
    </main>
  );
}
