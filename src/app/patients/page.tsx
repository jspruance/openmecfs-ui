// app/patients/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Patient Hub — Open ME/CFS",
  description: "Practical resources for people with or exploring ME/CFS.",
};

export default function PatientHubPage() {
  return (
    <div className="space-y-8">
      <header className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8">
        <h1 className="text-3xl font-bold">Patient Hub</h1>
        <p className="mt-2 text-blue-50 max-w-2xl">
          Practical tools, clinician directories, and advocacy resources to help
          you navigate ME/CFS.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/patients/checker"
            className="cursor-pointer rounded-md bg-white/95 text-blue-900 px-4 py-2 font-semibold hover:scale-[1.02] transition"
          >
            Do I have ME/CFS?
          </Link>
          <Link
            href="/patients/doctors"
            className="cursor-pointer rounded-md border border-white/70 text-white px-4 py-2 hover:bg-white/10 transition"
          >
            Find a Clinician
          </Link>
          <Link
            href="/patients/treatments"
            className="cursor-pointer rounded-md border border-white/70 text-white px-4 py-2 hover:bg-white/10 transition"
          >
            Treatments
          </Link>
          <Link
            href="/patients/advocacy"
            className="cursor-pointer rounded-md border border-white/70 text-white px-4 py-2 hover:bg-white/10 transition"
          >
            Advocacy & Care
          </Link>
        </div>
      </header>

      {/* Quick cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Clinicians & Centers",
            desc: "Curated list of clinics and specialists familiar with ME/CFS and OI.",
            href: "/patients/doctors",
          },
          {
            title: "Do I have ME/CFS?",
            desc: "Learn how clinicians think about the IOM 2015 criteria. (Not a diagnosis.)",
            href: "/patients/checker",
          },
          {
            title: "Treatments & Approaches",
            desc: "Pacing, OI medicines, LDN/LDA, mitochondrial support, antivirals, and more.",
            href: "/patients/treatments",
          },
          {
            title: "Advocacy & Care",
            desc: "Pacing, accommodations, disability paperwork, and communicating with providers.",
            href: "/patients/advocacy",
          },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="cursor-pointer block rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
            <p className="mt-1 text-gray-600 text-sm">{c.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
