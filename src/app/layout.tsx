import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import Script from "next/script";

export const metadata = {
  title: "Open ME/CFS — Collaborative ME/CFS Research & Education Platform",
  description:
    "A patient-led project advancing understanding, clinical education, and global collaboration around ME/CFS.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProd = process.env.NODE_ENV === "production";
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_SRC;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white text-gray-900 dark:bg-[#0f172a] dark:text-slate-100`}
      >
        {isProd && umamiSrc && umamiId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            strategy="afterInteractive"
          />
        )}

        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
