"use client";

import Image from "next/image";
import Link from "next/link";
import { FileDown } from "lucide-react"; // ← add this

const handleDonateClick = () => {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).umami?.track("donate_top_nav_click");
  }
};

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition"
        >
          <Image
            src="/logo-1-trans-bg.png"
            alt="Open ME/CFS Logo"
            width={36}
            height={36}
            className="h-7 w-7 md:h-8 md:w-8"
            priority
          />
          <span className="text-lg md:text-xl font-semibold text-gray-900">
            Open ME/CFS
          </span>
        </Link>

        {/* Right: Navigation Links */}
        <nav className="flex items-center gap-6 text-sm md:text-base">
          {/* <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link> */}
          <Link
            href="/mecfs"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ME/CFS
          </Link>
          <Link
            href="/research"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Research Lab
            <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              NEW
            </span>
          </Link>
          <Link
            href="/patients"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Patient Hub
          </Link>
          <Link
            href="/providers"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Provider Education
          </Link>
          <Link
            href="/community"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Community
          </Link>

          {/* 🔗 Contact Anchor */}
          {/* <Link
            href="/#contact"
            scroll={true}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Contact
          </Link> */}
          {/* NEW: One-Pager PDF */}
          <Link
            href="/api/one-pager"
            prefetch={false}
            className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 hover:border-slate-300 hover:shadow-sm cursor-pointer"
            title="Download the ME/CFS One-Pager (PDF)"
            aria-label="Download the ME/CFS One-Pager (PDF)"
          >
            <FileDown
              className="h-4 w-4 text-slate-700 group-hover:text-slate-900"
              aria-hidden
            />
            <span>One-Pager</span>
            <Image
              src="/pdf.png"
              alt="PDF"
              width={30}
              height={30}
              className="ml-1 h-[28px] w-[28px] object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          {/* 💛 Donate Button */}
          <Link
            href="/donate"
            onClick={handleDonateClick}
            className="bg-[#007BFF] text-white px-4 py-2 rounded-md font-medium shadow-md hover:bg-[#0D47A1] hover:shadow-lg transition"
          >
            Donate
          </Link>
        </nav>
      </div>
    </header>
  );
}
