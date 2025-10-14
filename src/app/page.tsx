"use client";

import Image from "next/image";
import Link from "next/link";
import ContactSection from "../components/ContactSection";

export default function HomePage() {
  return (
    <>
      {/* 🌅 HERO SECTION */}
      <section className="relative w-full bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-10 md:px-16 py-28 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
          {/* Left: Text + CTA */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
              Advancing Research, <br />
              <span className="text-blue-200">Empowering Patients</span>
            </h1>

            <p className="mt-4 text-lg text-blue-100 max-w-md mx-auto md:mx-0 leading-relaxed">
              Open ME/CFS unites research, data, and community to accelerate
              discovery and move closer to a cure for Myalgic Encephalomyelitis
              / Chronic Fatigue Syndrome.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-center md:justify-start">
              {/* 🔥 Primary Donate Button */}
              <Link
                href="/donate"
                onClick={() => (window as any).umami?.track("donate_click")}
                className="
                  relative inline-flex items-center justify-center
                  px-8 py-3 text-lg font-semibold rounded-md
                  bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400
                  text-blue-900 shadow-[0_0_20px_rgba(255,200,100,0.6)]
                  hover:shadow-[0_0_40px_rgba(255,200,100,0.8)]
                  hover:from-yellow-400 hover:via-amber-300 hover:to-yellow-200
                  hover:scale-[1.07] active:scale-[0.98]
                  transition-all duration-300 ease-out
                "
              >
                <span className="relative z-10">Donate</span>
                <span className="absolute inset-0 rounded-md bg-white/30 opacity-0 hover:opacity-50 blur-sm transition-opacity duration-300"></span>
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

      {/* 🌿 OUR MISSION SECTION */}
      <section className="w-full bg-white text-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-10 md:px-16 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Left: Image */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Image
              src="/diagnostic_lab.png"
              alt="Researchers collaborating in a diagnostic lab"
              width={600}
              height={400}
              className="w-full max-w-md rounded-2xl shadow-lg object-cover"
            />
          </div>

          {/* Right: Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              At <strong>Open ME/CFS</strong>, we believe that transparency,
              collaboration, and open access to research are the keys to
              accelerating discovery. By connecting data, researchers, and the
              community, we aim to unlock new insights and move the world closer
              to effective treatments—and ultimately, a cure—for Myalgic
              Encephalomyelitis / Chronic Fatigue Syndrome.
            </p>

            <Link
              href="/about"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* 🔬 EXPLORE RESEARCH SECTION */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white text-gray-800 py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore ME/CFS Research
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Browse our AI-powered library of summarized ME/CFS studies. Search,
            discover, and learn from the latest research—all in plain language.
          </p>

          <Link
            href="/research"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition"
          >
            Browse Research
          </Link>
        </div>
      </section>

      {/* 📬 CONTACT SECTION */}
      <ContactSection />
    </>
  );
}
