// app/patients/doctors/featured/page.tsx
import Link from "next/link";

type Featured = {
  name: string;
  city?: string;
  state?: string;
  country: string;
  tags: string[];
  notes?: string;
  website?: string;
};

const FEATURED_CLINICS: Featured[] = [
  {
    name: "Institute for Neuro-Immune Medicine (INIM) — Dr. Nancy Klimas",
    city: "Davie / Miami",
    state: "FL",
    country: "USA",
    tags: ["ME/CFS", "Long COVID", "Research clinic"],
    website: "https://www.nova.edu/nim/",
    notes: "High demand; research-driven care.",
  },
  {
    name: "Bateman Horne Center",
    city: "Salt Lake City",
    state: "UT",
    country: "USA",
    tags: ["ME/CFS", "FM", "Education"],
    website: "https://batemanhornecenter.org/",
    notes: "Clinic + patient education; waitlists common.",
  },
  {
    name: "Stanford ME/CFS Clinic",
    city: "Palo Alto",
    state: "CA",
    country: "USA",
    tags: ["ME/CFS", "Academic"],
    website: "https://med.stanford.edu/chronicfatiguesyndrome.html",
    notes: "Academic clinic; very limited intake.",
  },
  {
    name: "Center for Complex Diseases — Dr. David Kaufman / Dr. Bela Chheda",
    city: "Seattle",
    state: "WA",
    country: "USA",
    tags: ["ME/CFS", "MCAS", "Dysautonomia"],
    website: "https://www.centerforcomplexdiseases.com/",
    notes: "Specialist private clinic.",
  },
  {
    name: "Charité Fatigue Center",
    city: "Berlin",
    country: "Germany",
    tags: ["ME/CFS", "Long COVID", "Academic"],
    website: "https://cfc.charite.de/",
    notes: "University center; referral criteria apply.",
  },

  // Autonomic-focused (useful for OI/POTS common in ME/CFS)
  {
    name: "Vanderbilt Autonomic Dysfunction Center",
    city: "Nashville",
    state: "TN",
    country: "USA",
    tags: ["Autonomic", "POTS", "Syncope"],
    website: "https://www.vumc.org/autonomic-dysfunction-center/",
    notes: "Renowned autonomic center; testing and management.",
  },
  {
    name: "Mayo Clinic — Autonomic Neurology",
    city: "Rochester / Scottsdale / Jacksonville",
    country: "USA",
    tags: ["Autonomic", "Tilt testing"],
    website: "https://www.mayoclinic.org/",
    notes: "Autonomic labs at multiple campuses; referral needed.",
  },
  {
    name: "Mount Sinai Center for Post-COVID Care",
    city: "New York",
    state: "NY",
    country: "USA",
    tags: ["Long COVID", "ME/CFS overlap", "OI"],
    website: "https://www.mountsinai.org/locations/center-post-covid-care",
    notes: "Manages post-viral syndromes; ME/CFS-adjacent care.",
  },

  // Add more as you validate
  {
    name: "Dr. Susan Levine",
    city: "New York",
    state: "NY",
    country: "USA",
    tags: ["ME/CFS"],
    website: "https://neuroimmune.cornell.edu/",
    notes: "Longstanding ME/CFS specialist; private practice.",
  },
];

export const metadata = {
  title: "Featured Clinics — Open ME/CFS",
  description:
    "A curated list of notable ME/CFS and autonomic clinics to help patients get oriented.",
};

export default function FeaturedClinicsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ⭐ Featured Clinics
            </h1>
            <p className="text-gray-600 mt-1">
              A curated starting list of notable ME/CFS and autonomic (OI/POTS)
              clinics. Availability and intake vary — always verify current
              requirements.
            </p>
          </div>
          <Link
            href="/patients/doctors/directory"
            className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 transition"
          >
            Find a clinic near you →
          </Link>
          {/* <Link
            href="/patients/doctors"
            className="cursor-pointer text-blue-700 hover:underline"
          >
            ← Back to directory
          </Link> */}
        </header>

        <ul className="grid md:grid-cols-2 gap-4">
          {FEATURED_CLINICS.map((c) => (
            <li
              key={c.name}
              className="rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-900">{c.name}</h3>
              <p className="text-gray-600">
                {[c.city, c.state].filter(Boolean).join(", ")}
                {c.city || c.state ? ", " : ""}
                {c.country}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {c.notes && (
                <p className="mt-2 text-sm text-gray-600">{c.notes}</p>
              )}
              {c.website && (
                <a
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center mt-3 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50"
                >
                  Visit site ↗
                </a>
              )}
            </li>
          ))}
        </ul>

        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3">
          Educational only — not medical advice or a guarantee of access or
          outcomes. Use your clinical judgement and confirm details with each
          clinic.
        </p>
      </section>
    </main>
  );
}
