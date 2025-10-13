"use client";

import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {isHome ? (
        <main className="w-full">{children}</main>
      ) : (
        <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
          {children}
        </main>
      )}
    </>
  );
}
