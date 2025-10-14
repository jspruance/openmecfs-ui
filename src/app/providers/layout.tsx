// src/app/providers/layout.tsx
export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = [
    { href: "/providers", label: "Overview" },
    { href: "/providers/quick-start", label: "Quick-Start (10 min)" },
    { href: "/providers/diagnosis", label: "Diagnosis (IOM/NAM 2015)" },
    { href: "/providers/workup", label: "Differential & Workup" },
    {
      href: "/providers/orthostatic-intolerance",
      label: "Orthostatic Intolerance",
    },
    { href: "/providers/management", label: "Management Basics" },
    { href: "/providers/downloads", label: "Downloads" },
  ];
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
          <aside className="md:sticky md:top-16 h-fit">
            <nav className="space-y-1">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="block cursor-pointer rounded-md border border-transparent px-3 py-2 text-sm text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              For health professionals. Informational only — not medical advice.
            </div>
          </aside>
          <div>{children}</div>
        </div>
      </section>
    </main>
  );
}
