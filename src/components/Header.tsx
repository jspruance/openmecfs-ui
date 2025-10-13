"use client";

import Image from "next/image";
import Link from "next/link";

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
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/mecfs"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ME/CFS
          </Link>
          <Link
            href="/patients"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Patients
          </Link>
          <Link
            href="/research"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Research
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            About
          </Link>
          {/* 🔗 Contact Anchor */}
          <Link
            href="/#contact"
            scroll={true}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Contact
          </Link>
          {/* 💛 Donate Button */}
          <Link
            href="/donate"
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition"
          >
            Donate
          </Link>
        </nav>
      </div>
    </header>
  );
}
