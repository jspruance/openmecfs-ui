import Link from "next/link";
import "@/app/globals.css";

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="md:sticky md:top-16 h-fit">
            <nav className="space-y-1">
              <h2 className="font-semibold text-gray-800 mb-4">Research Lab</h2>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  <Link
                    href="/research/papers"
                    className="cursor-pointer block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  >
                    📄 Papers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/subtypes"
                    className="cursor-pointer block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  >
                    🧬 Subtypes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/mechanisms"
                    className="cursor-pointer block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  >
                    🧠 Mechanisms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/treatments"
                    className="cursor-pointer block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  >
                    💊 Treatments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/biomarkers"
                    className="cursor-pointer block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  >
                    🧪 Biomarkers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/hypotheses"
                    className="cursor-pointer block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  >
                    💡 AI Hypotheses
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <div>{children}</div>
        </div>
      </section>
    </main>
  );
}
