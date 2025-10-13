"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-10 md:px-16 py-28 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
        {/* Left: Text + CTA */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
            Advancing Research, <br />
            <span className="text-blue-200">Empowering Hope</span>
          </h1>

          <p className="mt-4 text-lg text-blue-100 max-w-md mx-auto md:mx-0 leading-relaxed">
            Open ME/CFS unites research, data, and community to accelerate
            discovery and move closer to a cure for Myalgic Encephalomyelitis /
            Chronic Fatigue Syndrome.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-center md:justify-start">
            {/* 🌅 White + Warm Glow Donate Button */}
            <Link
              href="/donate"
              className="
                relative inline-flex items-center justify-center
                px-8 py-3 text-lg font-semibold rounded-md
                text-blue-900
                bg-gradient-to-r from-white via-white to-pink-100
                shadow-[0_0_25px_rgba(255,180,150,0.4)]
                hover:shadow-[0_0_45px_rgba(255,160,130,0.7)]
                hover:scale-[1.08] active:scale-[0.97]
                transition-all duration-300 ease-out
              "
            >
              <span className="relative z-10">Donate</span>
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-pink-200/40 via-orange-100/30 to-transparent opacity-0 hover:opacity-100 blur-sm transition-opacity duration-300"></span>
            </Link>

            {/* Secondary Button */}
            <Link
              href="/about"
              className="
                border border-white/70 text-white px-8 py-3 rounded-md font-semibold
                hover:bg-white/15 hover:border-white transition-all duration-200
                hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]
              "
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right: Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Image
            src="/hp-1.jpg"
            alt="Medical research at microscope"
            width={700}
            height={450}
            className="w-full max-w-lg rounded-2xl shadow-2xl object-contain hover:scale-[1.02] transition-transform duration-500 ease-out"
            priority
          />
        </div>
      </div>
    </section>
  );
}
