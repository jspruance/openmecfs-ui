// app/patients/layout.tsx
import { Sparkles } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconClass?: string; // NEW
};

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems: NavItem[] = [
    { href: "/patients", label: "Patient Hub" },
    { href: "/patients/checker", label: "Do I have ME/CFS?" },
    // Gold sparkles ✨
    {
      href: "/patients/ai-assistant",
      label: "AI Dr Messaging Assistant",
      icon: Sparkles,
      iconClass: "text-amber-500", // <— gold
    },
    { href: "/patients/doctors", label: "Clinicians & Centers" },
    { href: "/patients/doctors/directory", label: "Find a clinic near you" },

    { href: "/patients/treatments", label: "Treatments & Approaches" },
    { href: "/patients/advocacy", label: "Advocacy & Care" },
    { href: "/patients/faq", label: "FAQ" },
    // app/patients/layout.tsx (inside navItems)
    { href: "/patients/one-pager", label: "ME/CFS One-Pager (PDF)" },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="md:sticky md:top-16 h-fit">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="cursor-pointer block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                >
                  <span className="inline-flex items-center gap-2">
                    {item.icon ? (
                      <item.icon
                        className={`h-4 w-4 ${item.iconClass ?? ""}`}
                      />
                    ) : null}
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>

            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              Educational only — not medical advice or diagnosis. Seek qualified
              care.
            </div>
          </aside>

          {/* Main content */}
          <div>{children}</div>
        </div>
      </section>
    </main>
  );
}
