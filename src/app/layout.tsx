import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import Script from "next/script";

export const metadata = {
  title: "Open ME/CFS — Collaborative ME/CFS Research & Education Platform",
  description:
    "A patient-led project advancing understanding, clinical education, and global collaboration around ME/CFS. Built to empower both patients and providers.",
  keywords: [
    "ME/CFS",
    "Myalgic Encephalomyelitis",
    "Chronic Fatigue Syndrome",
    "Long COVID",
    "post-exertional malaise",
    "pacing",
    "autonomic dysfunction",
    "Open ME/CFS",
    "patient-led research",
    "clinical education",
  ],
  authors: [{ name: "Open ME/CFS" }],
  creator: "Open ME/CFS",
  publisher: "Open ME/CFS",
  metadataBase: new URL("https://openmecfs.org"),
  openGraph: {
    title: "Open ME/CFS — Collaborative ME/CFS Research & Education Platform",
    description:
      "A patient-led platform for research, education, and advocacy around ME/CFS and related post-viral illnesses.",
    url: "https://openmecfs.org",
    siteName: "Open ME/CFS",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Open ME/CFS website preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open ME/CFS — Collaborative ME/CFS Research & Education Platform",
    description:
      "Patient-led project advancing understanding and care for ME/CFS.",
    creator: "@openmecfs",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
    <html lang="en" className={inter.className}>
      <body className="bg-white text-gray-900">
        {/* Umami (prod only) */}
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
