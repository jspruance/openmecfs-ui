"use client";

import {
  Heart,
  Users,
  FlaskConical,
  Globe,
  FileText,
  HandHeart,
} from "lucide-react";

const handleDonateClick = () => {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).umami?.track?.("donate_about_page_click");
  }
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* 🌅 Hero / Mission Section */}
      {/* 🌌 About Hero — true full-bleed + refined type */}
      <section
        className="
    relative w-screen left-1/2 right-1/2
    -ml-[50vw] -mr-[50vw]    /* force edge-to-edge, regardless of parent padding */
    overflow-hidden text-white py-24 lg:py-28
  "
        style={{
          backgroundImage:
            "radial-gradient(1100px 600px at 0% 0%, #1e40af 0%, #2563eb 45%, #3b82f6 85%)",
        }}
      >
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><rect width='1' height='1' fill='white' opacity='0.7'/></svg>\")",
            backgroundRepeat: "repeat",
          }}
        />

        {/* content container */}
        <div className="relative max-w-5xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
              Open ME/CFS
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Advancing research, transparency, and collaboration for Myalgic
            Encephalomyelitis / Chronic Fatigue Syndrome through open science,
            AI-powered insights, and community-driven data access.
          </p>

          {/* scroll indicator */}
          <div className="mt-10 flex justify-center">
            <div className="w-5 h-9 border-2 border-blue-200/80 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-blue-200/90 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 💡 Mission & Vision */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="text-blue-600" /> Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Open ME/CFS exists to accelerate discovery and understanding of
              ME/CFS by making research freely accessible and human-readable. We
              bridge patients, scientists, and clinicians through open data,
              AI-powered summaries, and evidence-based collaboration.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe that transparency, empathy, and technology together can
              shorten the path from study to solution — and ultimately to a
              cure.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl shadow-sm border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Globe className="text-blue-600" /> Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              A world where every patient, researcher, and physician can access
              clear, connected knowledge about ME/CFS — empowering faster
              treatments, better care, and renewed hope.
            </p>
          </div>
        </div>
      </section>

      {/* 🔬 What We Do */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            What We’re Building
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <FlaskConical className="text-blue-600" size={36} />,
                title: "AI-Powered Research Summaries",
                desc: "Our pipeline continuously fetches new PubMed studies, generates scientific and patient-friendly summaries, and organizes them for easy discovery.",
              },
              {
                icon: <FileText className="text-blue-600" size={36} />,
                title: "Open Database & API",
                desc: "We’re building an accessible, transparent ME/CFS research database — with metadata, citations, and semantic search for the scientific community.",
              },
              {
                icon: <Users className="text-blue-600" size={36} />,
                title: "Community Collaboration",
                desc: "We connect patients, advocates, and researchers to share knowledge, insights, and lived experience — because progress requires all voices.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition text-left"
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💬 Transparency & Funding */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Transparency & Impact
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto">
            Open ME/CFS operates with a commitment to open-source transparency.
            All funds received through donations go toward platform maintenance,
            data hosting, AI processing, and direct support for ME/CFS research
            organizations.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-8 mt-10">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm flex-1">
              <HandHeart className="text-blue-600 mb-2 mx-auto" size={36} />
              <h3 className="font-semibold text-gray-900 mb-1">
                Donation Allocation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                ~30 % platform development · 70 % ME/CFS research support
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm flex-1">
              <Globe className="text-blue-600 mb-2 mx-auto" size={36} />
              <h3 className="font-semibold text-gray-900 mb-1">
                Open by Design
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Source code, datasets, and summaries shared freely on GitHub to
                encourage collaboration and trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 CTA */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Join Us in Opening the Future of ME/CFS Research
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Support open data, transparency, and patient-driven science.
        </p>
        <a
          href="/donate"
          onClick={handleDonateClick}
          className="inline-block bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-blue-900 px-8 py-3 rounded-md font-semibold shadow-[0_0_20px_rgba(255,200,100,0.6)] hover:shadow-[0_0_40px_rgba(255,200,100,0.8)] hover:scale-[1.05] transition-all duration-300 ease-out"
        >
          Donate to Support Research
        </a>
      </section>
    </main>
  );
}
